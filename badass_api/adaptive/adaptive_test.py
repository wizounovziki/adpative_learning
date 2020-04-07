#!/usr/bin/env python
# coding: utf-8
# this function generates an item bank, in case the user cannot provide one
from catsim.cat import generate_item_bank
# simulation package contains the Simulator and all abstract classes
from catsim.simulation import *
# initialization package contains different initial proficiency estimation strategies
from catsim.initialization import *
# selection package contains different item selection strategies
from catsim.selection import *
# estimation package contains different proficiency estimation methods
from catsim.estimation import *
# stopping package contains different stopping criteria for the CAT
from catsim.stopping import *
import catsim.plot as catplot
import catsim.cat as cat

import datetime
import numpy as np
import logging
import pandas as pd
import sqlalchemy as db1
import json
import random,math

from model.quiz import *
from model.results import *
from app import db


class dataBase:
    engine = None
    
    def __init__(self,username,password,database,ip_address='localhost'):
        self.engine = db1.create_engine('mysql+pymysql://'+username+':'+password+'@'+ip_address+'/'+database)
        # # print("ad engine lauching......")
        
    def create_table(self):
        self.engine.execute("""
        CREATE TABLE quiz_log( id int auto_increment primary key, 
        quiz_id varchar(255),
        student_id varchar(255),
        session_id varchar(255),
        exam_id varchar(255),
        details json)
        """)
        
    def show_databases(self):
        self.engine.execute('SHOW DATABASES').fetchall()
        
    def show_tables(self):
        self.engine.execute('SHOW TABLES').fetchall()
    
    def reset_table(self):
        self.engine.execute('TRUNCATE quiz_log')
    
    def real_time_data(self):
        query_log = 'SELECT * FROM quiz_log where details->"$.status"="processing"'
        raw_data = self.engine.execute(query_log).fetchall()
        return raw_data

        
    def insert_data(self,examinee):       
        data_val = Quiz(
            quiz_id = examinee['quiz_id'],
            student_id = examinee['student_id'],
            session_id = examinee['session_id'],
            exam_id = examinee['exam_id'],
            details = examinee
        )
        return data_val
    
    def update_data(self,examinee):
        # update_log = ("UPDATE quiz_log  "
        #       "SET details=(%(details)s) "
        #       "WHERE exam_id=(%(exam_id)s)")
        # data_val =  {
        #   'exam_id': examinee['exam_id'],
        #   'details': json.dumps(examinee),
        # }
        # self.engine.execute(update_log,data_val)
        print("****  testing  ****")
        print(examinee['exam_id'])
        print(len(Quiz.query.all()))


class adaptiveTest:
    
    items = []
    initializer = None
    selector = None
    estimator = None
    stopper = None
    questions_df = None
    database = None
    active_examinees={}
    
    def __init__(self,items,database=None):
        
        # init database
        # # print(database)
        if database:
            self.database = database
        
        # init items
        if not items:
            # to be remove
            self.items = self.gen_item_bank(bank_size=200)
            
        elif isinstance(items,str):
            self.questions_df = pd.read_csv(items,
                                            converters={i:str for i in ['A','B','C','D','Answer']})
            # # print(self.questions_df)                                
            self.items = np.zeros((self.questions_df.shape[0],5))
            self.items[:,0] = 1.0
            self.items[:,1] = self.questions_df['Difficulty'].values
            self.items[:,2] = 0.0
            self.items[:,3] = 1.0
            self.items[:,4] = 0.0
            
        else:
            self.items = items
            
        # creating CAT pipline
        # create a random proficiency initializer
        self.initializer = RandomInitializer()

        # create a maximum information item selector
        self.selector = MaxInfoSelector()

        # create a hill climbing proficiency estimator
        self.estimator = HillClimbingEstimator()

        # create a stopping criterion that will make tests stop after 20 items
        self.stopper = MaxItemStopper(len(self.items))
        # stopper = MinErrorStopper(.01)
        
        # init log
        # self.init_logging()
        
        
        # self.questions_df = pd.read_csv('../data/Math/P1-2_processed.csv')
        
    
    def init_logging(self,fname='server.log'):
        logging.basicConfig(filename='server.log', 
                    filemode='w', 
                    format='%(asctime)s - %(levelname)s - %(message)s')
        logging.getLogger().setLevel(logging.INFO)
        
    
    def register_examinee(self,student_id, session_id,quiz_id):
        if (str(student_id) + str(session_id)) in self.active_examinees:
            return False
        
        # check existing student in the list
        for examinee_id in self.active_examinees:
            if self.active_examinees[examinee_id]['student_id']== student_id:
                return False
        
        examinee = {}
        # registering examinee for test
        #examinee['start_time'] = datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")
        examinee['start_time'] = datetime.datetime.now().timestamp()
        examinee['exam_id'] = str(student_id) + str(session_id)
        examinee['quiz_id'] = quiz_id
        examinee['student_id'] = student_id
        examinee['session_id'] = session_id
        # administered_items
        examinee['administered_items'] = []
        examinee['administered_items_ts'] = []
        examinee['difficulties'] = []
        # response
        examinee['submitted_answer'] = []
        examinee['responses'] = []
        examinee['responses_ts'] = []
        # if there is no quiz record
        examinee['history'] = None
        # manually initialize an examinee's proficiency as a float variable
        examinee['est_theta'] = self.initializer.initialize()
        examinee['AI'] = []
        # manually initialized with 0 for equal chance
        # examinee['est_theta'] = 0.0
        # retrieve from database if there is
        student_portrait = "5b30aa65-07e9-4c15-859a-c4a340746b5f.jpg"
        if student_id == 'Alice' or student_id == 'Bob' or student_id == 'Charles':
            student_portrait = student_id+".jpg"
        examinee['student_info'] = {
            "student_id": student_id,
            "student_name": student_id,
            "student_portrait": student_portrait
	    }
        examinee['quiz_status'] = "processing"
        examinee['quiz_type'] = ["distracted","neural","engaged","lost"]
        # adding to the test
        self.active_examinees[examinee['exam_id']] = examinee
        
        # adding to database
        if self.database:
            ql = self.database.insert_data(examinee)
            db.session.add(ql)
            db.session.flush()
            db.session.commit()

        return True
    
    def real_time_data(self):
        return self.database.real_time_data()

    def remove_examinee(self,student_id,session_id):
        if (str(student_id) + str(session_id)) in self.active_examinees:
            examinee = self.active_examinees[str(student_id)+str(session_id)]
            # this_quiz = Quiz.query.filter_by(student_id=input_data['id'],session_id=input_data['session_id']).first()
            # if len(this_quiz.details['responses'])<1:
            #     tmp = adt_test.update_response(input_data['id'],input_data['session_id'],"F")
            examinee["quiz_status"] = "ended"
            if len(examinee["responses"])<1:
                examinee["submitted_answer"].append("F")
                examinee["responses_ts"].append(datetime.datetime.now().timestamp())
                examinee["responses"].append(False)
                examinee["AI"].append("lost")

            if self.database:
                self.database.update_data(examinee)
                quiz = Quiz.query.filter_by(exam_id = examinee['exam_id']).first()
                if quiz is not None:
                    quiz.details = examinee
                    db.session.flush()
                    db.session.commit()
            del self.active_examinees[str(student_id) + str(session_id)]
            return True
        else:
            return False
           
    def gen_item_bank(self,bank_size,itemtype='1PL'):
        # generate an item bank
        items = generate_item_bank(bank_size,itemtype=itemtype)
        return items
    
    def check_correct_answer(self,question_id,choice):
        # single answer
        return bool((self.questions_df.loc[self.questions_df['ID']==question_id,'Answer']==choice).values[0])
    
    def update_response(self,student_id, session_id,response,ind=-1):
        # temporary function to conclude data from pics
        ai = ["left","right","center","closed","lost"]
        ai_dict = {
            "eye_gazing":["left","right","center","closed","lost"],
            "head_motion":["left","right","center","lost"],
            "distraction":["distracted","neural","engaged","lost"],
        }

        def get_frames(time1,time2):
            print("time1:"+str(time1))
            print("time2:"+str(time2))
            tests = Results.query.all()
            print("db last col:"+str(tests[-1].time_stamp))
            results = Results.query.filter(Results.student_id==student_id,Results.time_stamp<time1,Results.time_stamp>time2).all()
            rs = []
            method = "distraction"
            print("getting frames......")
            print(len(results))
            if len(results)<=0:
                time = time1 - time2          
                frame_rate = 0.2
                frame_num = int(math.floor(time/frame_rate))
                
                for i in range(0,frame_num):
                    rs.append(ai_dict["distraction"][random.randint(0,len(ai_dict["distraction"])-1)])
            else:
                rs = [r.inference for r in results]
                method = results[0].method
            return rs,method

        def get_ai(frames,method):
            # # print(np.argmax(np.bincount(array)))
            count_dict = {"eye_gazing":{"left":0,"right":1,"center":2,"closed":3,"lost":4},"head_motion":{"left":0,"right":1,"center":2,"lost":3},"distraction":{"distracted":0,"neural":1,"engaged":2,"lost":3}}
            num_array = []
            for f in frames:
                num_array.append(count_dict[method][f])
            # # print("****** ai here ******")    
            # # print(ai[np.argmax(np.bincount(num_array))])
            return ai_dict[method][np.argmax(np.bincount(num_array))]
            

        # loading examinee data
        examinee = self.active_examinees[str(student_id)+str(session_id)]
        
        if ind==-1:
            if len(examinee['administered_items'])==len(examinee['responses'])+1:
                examinee['submitted_answer'] += [response]
                response = self.check_correct_answer(examinee['administered_items'][-1],response)
                examinee['responses'] += [response]
                examinee['responses_ts'] += [datetime.datetime.now().timestamp()]
                # # print("************ first ************")
                # # print(examinee['responses_ts'])
                fs,method = get_frames(float(examinee["responses_ts"][-1]),float(examinee["administered_items_ts"][-1]))
                examinee['AI'].append(get_ai(fs,method))
                examinee['quiz_type'] = ai_dict[method]
                # update to database
                if self.database:
                    self.database.update_data(examinee)
                    quiz = Quiz.query.filter_by(exam_id = examinee['exam_id']).first()
                    if quiz is not None:
                        quiz.details = examinee
                        db.session.flush()
                        db.session.commit()
                return True
            else:
                return False
        else:
            # correction
            if ind<len(examinee['responses']):
                examinee['submitted_answer'][ind] = [response]
                response = self.check_correct_answer(examinee['administered_items'][ind],response)
                examinee['responses'][ind] = response
                examinee['responses_ts'][ind] = [datetime.datetime.now().timestamp()]
                # examinee['AI'][ind] = get_ai(get_frames(float(examinee["responses_ts"][ind]),float(examinee["administered_items_ts"][ind])))
                fs,method = get_frames(float(examinee["responses_ts"][ind]),float(examinee["administered_items_ts"][ind]))
                examinee['AI'][ind] = get_ai(fs,method)
                examinee['quiz_type'][ind] = ai_dict[method]
                # update to database
                if self.database:
                    self.database.update_data(examinee)
                    quiz = Quiz.query.filter_by(exam_id = examinee['exam_id']).first()
                    if quiz is not None:
                        quiz.details = examinee
                        db.session.flush()
                        db.session.commit()
                return True
            else:
                return False
                
    
    def get_question_index(self,student_id, session_id):
        
        # loading examinee data
        examinee = self.active_examinees[str(student_id)+str(session_id)]
        
        if len(examinee['administered_items'])== 0:
            # first question
            examinee['administered_items'] = list(np.random.randint(low=len(self.items)//3,
                                                                    high=(len(self.items)*2)//3,size=1))
            examinee['administered_items'][0] = int(examinee['administered_items'][0])
            examinee['administered_items_ts'] += [datetime.datetime.now().timestamp()]
            examinee['difficulties'] += [float(self.items[examinee['administered_items'][0]][1])]
            # update to database
            if self.database:
                self.database.update_data(examinee)
                quiz = Quiz.query.filter_by(exam_id = examinee['exam_id']).first()
                if quiz is not None:
                    quiz.details = examinee
                    db.session.flush()
                    db.session.commit()
            
            return self.questions_df.loc[self.questions_df['ID']==examinee['administered_items'][0],:].to_dict('record')[0]
        else:
            # not first question
            
            # last question is not answered
            if len(examinee['administered_items'])>len(examinee['responses']):
                # to be update for skip later ..
                # submit answer first
                return -1
            
            stop_flag = self.stopper.stop(administered_items=self.items[examinee['administered_items']], 
                              theta=examinee['est_theta'])
            if not stop_flag:
                
                examinee['est_theta'] = self.estimator.estimate(items=self.items,
                                         administered_items=examinee['administered_items'],
                                         response_vector = examinee['responses'],
                                         est_theta=examinee['est_theta']
                                        )
                item_index = self.selector.select(items=self.items,
                                                 administered_items=examinee['administered_items'],
                                                 est_theta=examinee['est_theta'])
                if item_index:
                    examinee['administered_items'] += [int(item_index)]
                    examinee['administered_items_ts'] += [datetime.datetime.now().timestamp()]
                    examinee['difficulties'] += [float(self.items[item_index][1])]
#                     #init response to avoide skip
#                     examinee['responses'] += [False]
                    # update to database
                    if self.database:
                        self.database.update_data(examinee)
                        quiz = Quiz.query.filter_by(exam_id = examinee['exam_id']).first()
                        if quiz is not None:
                            quiz.details = examinee
                            db.session.flush()
                            db.session.commit()
                    return self.questions_df.loc[self.questions_df['ID']==item_index,:].to_dict('record')[0]
                else:
                    # question run out finished
                    return None
            else:
                # test finished
                return None
        

def unit_test():
    test = adaptiveTest(items='Math/P1-2_processed.csv')
    
    # # print('Registration-test')

    test.register_examinee('0','1')

    test.register_examinee('2','2')

    # # print(test.active_examinees)
    
    # # print('Question-test')
    test.get_question_index('2','2')
    test.update_response('2','2','D')
    
    # # print(test.active_examinees)
    
    test.get_question_index('2','2')
    test.update_response('2','2','D')
    
    # # print(test.active_examinees)




def student_test_skill():
    test = adaptiveTest(items='Math/P1-2_processed.csv')
    test.register_examinee('0','1','quiz_1')
    while test.get_question_index('0','1'):
        test.update_response('0','1','D')
        # # print(test.active_examinees['01']['est_theta'],
        #      sum(test.active_examinees['01']['responses'])/len(test.active_examinees['01']['administered_items']))



def student_simulate(testdb):
    test = adaptiveTest(items='Math/P1-2_processed.csv',database=testdb)
    ## print(len(test.items))
    test.register_examinee('student4','session4','quiz_1')
    while test.get_question_index('student4','session4'):
        test.update_response('student4','session4','D')
        # # print(test.active_examinees['student0session1']['est_theta'],
        #       sum(test.active_examinees['student0session1']['responses'])/len(test.active_examinees['student0session1']['administered_items']))

# student_test_skill()

if __name__ == '__main__':
    # test script
    testdb = dataBase('root','BreakingBad','adaptive_learning')
    # testdb.create_table()
    testdb.reset_table()
    student_simulate(testdb)

