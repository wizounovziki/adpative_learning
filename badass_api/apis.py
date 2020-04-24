# -*- coding: utf-8 -*-
# @Author: User
# @Date:   2019-11-29 09:04:26
# @Last Modified by:   fyr91
# @Last Modified time: 2019-12-11 12:39:06
import os, uuid, json, cv2,xlrd
import numpy as np
from app import app, emotion_model,faceCascade,detector,eye_predictor,db
from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, send_from_directory, request,Response,g
from utils.base64_encoder import encode, decode
from utils.analysis import analysis
import sqlalchemy as db1
from model.question import *
from model.quiz import *
from model.results import *
import random
import csv,math

from flask import session
# flask session is removed for unity client
# from flask import session
import datetime
import json
import secrets
import adaptive.adaptive_test as adt

# initialize database
# testdb = adt.dataBase('root','root','test_db')

# initialize the adaptive test
# 'debian-sys-maint','yGdsPQQ7Zl7lVUCi'
adt_db = adt.dataBase('debian-sys-maint','yGdsPQQ7Zl7lVUCi','adaptive_learning')
adt_test = adt.adaptiveTest(items='./adaptive/Math/dataset_20200420.xlsx',database=adt_db)

# to be remove after solving unity client session
session = {}

template = {"session_id":"","exam_id":"","quiz_id":"","student_id":"","history":None,"est_theta":0,"start_time":0,"student_info":{},"adiminstered_items":[],"difficulties":[],"submitted_answer":[],"responses":[],"administered_items_ts":[],"responses_ts":[],"AI":[]}

def recording_ai(result,timestamp,method,student_id):
    # assume that only one ai method would be chosen
    res = result
    ts = float(timestamp)
    mtd = method
    r = Results(
        inference = res,
        time_stamp = ts,
        method = mtd,
        student_id = student_id
    )
    db.session.add(r)
    db.session.commit()

adaptive_api = Blueprint('adaptivetest',__name__)
@adaptive_api.route('/adaptivetest',methods=['POST'])
def adaptive_test():
    # need to add create question
    # to be removed after sovling unity client session 
    fps = 5
    global session
    # global template
    global is_updated
    if request.method=='POST':
        input_data = request.form       
        # register student for test session
        if input_data['command']=='new':
            if str(input_data['id']) in session:
                return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                                'message' : 'id already exist'
                               })
            print("new quiz come.")
            temp = secrets.token_hex()
            # print(adt_test.database)
            # status = adt_test.register_examinee(str(input_data['id']),temp,"quiz_1")
            try:
                status = adt_test.register_examinee(str(input_data['id']),temp,input_data["quiz_id"])
            except:
                status = adt_test.register_examinee(str(input_data['id']),temp,"testing_quiz")
            
            is_updated = True
            # print(adt_test.active_examinees)
            if status:
                session[input_data['id']] = temp
                return jsonify({'id':input_data['id'],
                                'session_id': session[input_data['id']],
                                'status' : 'quiz_start'
                               })
            else:
                return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                                'message' : 'fail to register'
                               })
            
        # session error
        try:
            # session time out
            if input_data['id'] not in session:
                try:
                    status = adt_test.remove_examinee(input_data['id'],input_data['session_id'])
                    if status:
                        print('Session timeout')
                    # print(adt_test.active_examinees)
                except:
                    return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                                'message': 'session time out'
                               })
            # session id check
            if (session[input_data['id']] != input_data['session_id']):
                return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                                'message' : 'session id incorrect'
                               })
        except:
            return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                            'message': 'pls register first'
                               })
        
        if input_data['command']=='end':
            print("end_quiz")
            print(input_data["session_id"])

            # print(adt_test.active_examinees)
            status = adt_test.remove_examinee(input_data['id'],input_data['session_id'])            
            if status:
                del session[input_data['id']]
                is_updated = True
                return jsonify({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'status' : 'quiz_forced_end'
                               })
            else:
                return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                                'message': 'check registeration'
                               })
            
        elif input_data['command']=='next':
            print("next question")
            question = adt_test.get_question_index(input_data['id'],input_data['session_id'])
            # print(adt_test.active_examinees)
            if question:
                if question==-1:
                    return jsonify({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'status' : 'quiz_error',
                                'message' : 'submit answer first'
                               })
                else:
                    # is_updated = True
                    ques = {'id':input_data['id'],
                            'session_id': input_data['session_id'],
                            'question_id': str(question['id']),
                            'question': question['question'],
                            'choices': {item:question[item] for item in ['A','B','C','D']},
                            'correct_answer': question['answer'],
                            'status' : 'quiz_question',
                            'is_mcq':question["is_mcq"],
                            'image':question["base64"]
                            }
                    return json.dumps(ques)
            else:
                return jsonify({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'status' : 'quiz_end'
                               })
            
        elif input_data['command']=='answer':
            print("answer")
            status = adt_test.update_response(input_data['id'],input_data['session_id'],input_data['chosen_answer'])
            # print(adt_test.active_examinees)
            print(status)
            if status:
                is_updated = True
                return json.dumps({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'question_id': str(input_data['question_id']),
                                'status':'quiz_ans_update'
                               })
            else:
                return json.dumps({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'question_id': str(input_data['question_id']),
                                'status' : 'quiz_ans_update_fail'
                               })
                

# initialize the adaptive test
adt_test = adt.adaptiveTest(items='./adaptive/Math/dataset_20200420.xlsx',database=adt_db)

portrait_api = Blueprint('portrait',__name__)
@portrait_api.route('/portrait/<path:path>')
def send_portrait(path):
    dirpath = 'storage/uploads/images'
    print(dirpath)
    print(path)
    return send_from_directory(dirpath,path)

init_api = Blueprint('init',__name__)
@init_api.route('/init',methods=['POST'])
def create_db():
    db.create_all()
    return jsonify({"msg":"success"})

question_init_api = Blueprint('question_init',__name__)
@question_init_api.route('/question_init',methods=['GET'])
def init_question():
    testing_data = []
    # template = {'id':1,'primary':'P1','question':'9 ones is the same as____','A':'7','B':'3','C':'9','D':'5','answer':'C','category':'numbers','difficulty':'-3.0'}
    # with open('./adaptive/Math/dataset_20200420.xlsx','r',errors='ignore',encoding='utf-8') as qs:
    #     reader = csv.reader(qs)
    #     for col,rows in enumerate(reader):
    #         try:
    #             if col == 0:
    #                 print(rows)
    #                 testing_data = rows
    #             if col>0:
    #                 # print(rows[19])
    #                 if rows[19]=="No":
    #                     print(str(rows[5]))
    #         except:
    #             print(col)
    #             template['id'] = rows[0]
    #             template['primary'] = str(rows[1])
    #             template['question'] = str(rows[2])
    #             template['A'] = str(rows[3])
    #             template['B'] = str(rows[4])
    #             template['C'] = str(rows[5])
    #             template['D'] = str(rows[6])
    #             template['answer'] = str(rows[7])
    #             template['category'] = str(rows[8])
    #             template['difficulty'] = str(rows[9])
    #             if Question.query.get(template['id']) is None:                
    #                 q = Question(
    #                     id = int(template['id']),
    #                     data =template    
    #                 )
    #                 db.session.add(q)
    #                 db.session.commit()
    
    # new_template = {'id':1,'level':'P1',"subject":"Math",'question':'9 ones is the same as____',"is_mcq":"Yes",
    #                 'A':'7','B':'3','C':'9','D':'5','answer':'C','category':'numbers','difficulty':'-3.0',"marks":1,
    #                 'year':2019,"school":"sample","exam":"CA1","paper":"","number":0,"image":"No","image_file":"","base64":""}

    data = xlrd.open_workbook("./adaptive/Math/dataset_20200420.xlsx")
    questions = data.sheet_by_index(0)
    nrows = questions.nrows
    column_names = []
    for i in range(nrows):
        if i<=0:
            column_names = questions.row_values(i)
        else:
            row_data = {}
            for idx in range(0,len(column_names)):
                row_data[column_names[idx]] = questions.row_values(i)[idx]
            testing_data.append(row_data)
            if Question.query.get(row_data['id']) is None:                
                q = Question(
                    id = int(row_data['id']),
                    data = row_data    
                )
                db.session.add(q)
                db.session.commit()    
        # new_template["id"] = questions.row_values(i)[0]
        # new_template["level"] = questions.row_values(i)[1]
        # new_template["question"] = question.
        # testing_data.append(new_template)
    return jsonify(testing_data[0])


quiz_log_api = Blueprint('quiz_log',__name__)
@quiz_log_api.route('/quiz_log',methods=['GET'])
def QuizLog():
    print("new request come~")
    def modify_returning(data):
        # take eye_gazing as one example
        AI_response = ["left","right","center","closed","lost"]
        ratio_num = 7
        for q in data:
            details = q["details"]
            diffs = details["difficulties"]
            details["difficulties"] = [math.floor((float(d)+3.0)*10/ratio_num)+1 for d in diffs]
            mark = False
            try:
                if len(details["AI"])>0:
                    mark = True
                    print("try")
            except:
                details["AI"] = []
                print("except")
            details["response_time"] = []
            details["question_details"] = []
            details["student_info"] = {"student_id":details["student_id"],"student_name":details["student_id"],"student_portrait":"5b30aa65-07e9-4c15-859a-c4a340746b5f.jpg"}

            for i in range(0,len(details["submitted_answer"])):
                rt  = 0
                if float(details["responses_ts"][i])-float(details["administered_items_ts"][i])>1:
                    rt = math.ceil(float(details["responses_ts"][i])-float(details["administered_items_ts"][i]))
                else:
                    rt = int(100*(float(details["responses_ts"][i])-float(details["administered_items_ts"][i])))+random.randint(0,9)
                details["response_time"].append(rt)
                if not mark:
                    details["AI"].append(AI_response[random.randint(0,4)])
                details["question_details"].append({'id':details["administered_items"][i],'data':Question.query.get(int(details["administered_items"][i])).data})
            q["details"] = details
       
        return data
    is_updated = True

    def event_stream():
        global is_updated
        is_updated = True
        while True:
            if is_updated:
                raw_data = Quiz.query.filter(Quiz.details['quiz_status']=="processing").all()
                    
                try:
                    qid = raw_data[-1].quiz_id
                    print(qid)
                    raw_data = Quiz.query.filter_by(quiz_id=qid).all()
                except:
                    print("no holding quiz.")    
                print(len(raw_data))
                data = []
                for rd in raw_data:
                    data.append({"id":rd.id,"quiz_id":rd.quiz_id,"student_id":rd.student_id,"session_id":rd.session_id,"exam_id":rd.exam_id,"details":rd.details})
                # global is_updated
                is_updated = False
                data = modify_returning(data)               
                print(str(len(data)))
                
                yield 'data: %s\n\n' % json.dumps(data)
                # engine = engine.close()    
                break     
                # yield 'data: %s\n\n' % str(len(data))
    return Response(event_stream(),mimetype="text/event-stream")

def standardlize_scores(num):
    ratio_num = 7
    return math.floor((float(num)+3.0)*10/ratio_num)+1

quiz_details_api = Blueprint("quiz_details",__name__)
@quiz_details_api.route("/quiz_details/<string:qid>",methods = ["GET"])
def quiz_details(qid):
    if request.method == "GET":
        quiz_list = []
        quiz_immu = []
        student_immu = []
        if qid == "0":
            quiz_list = Quiz.query.filter(Quiz.details["quiz_status"]=="ended",Quiz.details["submitted_answer"]!=[]).all()
            # print(len(quiz_list))
            for q in quiz_list:
                if not q.quiz_id in quiz_immu:
                    quiz_immu.append(q.quiz_id)
            # print(quiz_immu)
        else:
            quiz_list = Quiz.query.filter(Quiz.quiz_id==qid,Quiz.details["quiz_status"]=="ended",Quiz.details["submitted_answer"]!=[]).all()
            if len(quiz_list)<=0:
                return jsonify()
            else:
                quiz_immu.append(qid)
        for q in quiz_list:
            if not q.student_id in student_immu:
                student_immu.append(q.student_id)

        quiz_dict = []
        # print(student_immu)
        for qid in quiz_immu:
            s_list = []
            for stuid in student_immu:
                template = {}
                quiz = Quiz.query.filter_by(quiz_id=qid,student_id=stuid).first()
                try:
                    rst = []
                    for i in range(0,len(quiz.details["responses_ts"])):
                        rst.append(float(quiz.details["responses_ts"][i])-float(quiz.details["administered_items_ts"][i]))
                    q_details = [Question.query.get(i).data for i in quiz.details["administered_items"]]
                    template[stuid] = {"response_time":rst,"skill_level":standardlize_scores(quiz.details["est_theta"]),"difficulties":[standardlize_scores(float(s)) for s in quiz.details["difficulties"]],"responses":quiz.details["responses"],"emotion":quiz.details["AI"],"question_details":q_details}
                    s_list.append(template)
                except:
                    continue
            quiz_type = []
            try:
                quiz_type = Quiz.query.filter_by(quiz_id=qid).first().details["quiz_type"]
            except:
                quiz_type = ["distracted","neural","engaged","lost"]  
                # quiz_type = ["left","right","center","closed","lost"]
            recommend = "Average skill for the class is improving and recommend to reduce distraction."
            if len(s_list)>0:
                quiz_dict.append({qid:{"data":s_list,"quiz_type":quiz_type,"recommendation":recommend}})
        return jsonify(quiz_dict)

student_list_api = Blueprint("student_list",__name__)
@student_list_api.route("/student_list",methods = ["GET"])
def student_list():
    if request.method == "GET":
        # stu_list = student.query.all()
        quiz_logs = Quiz.query.filter(Quiz.details["quiz_status"]=="ended").all()
        stu_list = []
        for ql in quiz_logs:
            if not ql.student_id in stu_list:
                stu_list.append(ql.student_id)
        print(stu_list)
        res = []
        temp1 = {"student_name":"","image":"5b30aa65-07e9-4c15-859a-c4a340746b5f.jpg","proficiency":0,"difficulty":0}
        for stuid in stu_list:

            quiz_sample = Quiz.query.filter(Quiz.student_id==stuid,Quiz.details["quiz_status"]=="ended",Quiz.details["submitted_answer"]!=[]).all()[-1]
            res.append({"student_name":stuid,"image":quiz_sample.details["student_info"]["student_portrait"],"proficiency":standardlize_scores(quiz_sample.details["est_theta"]),"difficulty":standardlize_scores(quiz_sample.details["difficulties"][-1]),"emotion":quiz_sample.details["AI"][-1]})

        return jsonify(res)

student_details_api = Blueprint("student_details",__name__)
@student_details_api.route("/student_details/<string:stuid>",methods = ["GET"])
def student_details(stuid):

    def rank_calculate(q_list,score):
        rank = 1
        for q in q_list:
            if float(q.details["est_theta"])>score:
                rank+=1
            elif float(q.details["est_theta"])==score and q.student_id is not stuid:
                # if int(stuid[-1])>int(q.student_id[-1]):
                if stuid>q.student_id:
                    rank+=1
        return rank

    def best_and_worst(q_list):
        # all the quiz that one student has already done.
        category_list = []
        buckets = []
        questions = Question.query.all()
        for q in questions:
            if q.data["category"] not in category_list:
                category_list.append(q.data["category"])
                buckets.append({"category":q.data["category"],"count":0})
        for q in q_list:
            for idx in range(0,len(q.details["responses"])):
                question = Question.query.get(int(q.details["administered_items"][idx]))
                if q.details["responses"][idx]:
                    buckets[category_list.index(question.data["category"])]["count"]+=1
                else:
                    buckets[category_list.index(question.data["category"])]["count"]-=1
        buckets = sorted(buckets,key =lambda k:k["count"])
        # return buckets[-1],buckets[0]
        return buckets[-1]["category"],buckets[0]["category"]

    indi_quiz = Quiz.query.filter(Quiz.student_id==stuid,Quiz.details["quiz_status"]=="ended",Quiz.details["submitted_answer"]!=[]).all()
    if len(indi_quiz)<1:
        return jsonify()
    iqz = []
    try:
        iqz = sorted(indi_quiz,key =lambda k:int(k.quiz_id.split("_")[-1]))
    except:
        iqz = indi_quiz
    quiz_list = []
    for q in iqz:
        if q.quiz_id not in quiz_list:
            quiz_list.append(q.quiz_id)     
    pre_rank = 1
    current_rank = 1
    pre_skill_level = 0
    cur_skill_level = 0
    strong_area = ""
    improvements = ""
    if len(iqz)<2:
        # only taken one quiz:
        pre_skill_level = cur_skill_level = iqz[0].details["est_theta"]
        pre_rank = current_rank = rank_calculate(Quiz.query.filter_by(quiz_id=iqz[0].quiz_id).all(),float(cur_skill_level)) 
    else:
        pre_skill_level = iqz[-2].details["est_theta"]
        cur_skill_level = iqz[-1].details["est_theta"]
        current_rank = rank_calculate(Quiz.query.filter_by(quiz_id=iqz[-1].quiz_id).all(),float(cur_skill_level))
        pre_rank = rank_calculate(Quiz.query.filter_by(quiz_id=iqz[-2].quiz_id).all(),float(pre_skill_level))

    strong_area,improvements = best_and_worst(iqz)
    recommend = "Keep up in type "+strong_area+",and try more on type "+improvements+"."
    quiz_template = []
    for q in iqz:
        q_data = [Question.query.get(i).data for i in q.details["administered_items"]]
        quiz_type = []
        try:
            quiz_type = q.details["quiz_type"]
        except:
            quiz_type = ["distracted","neural","engaged","lost"]
            # quiz_type = ["left","right","center","closed","lost"]
        rst = []
        for i in range(0,len(q.details["responses_ts"])):

            rst.append(float(q.details["responses_ts"][i])-float(q.details["administered_items_ts"][i]))
        details = {"difficulties":[standardlize_scores(d) for d in q.details["difficulties"]],"responses":q.details["responses"],
                   "response_time":rst,"student_answers":q.details["submitted_answer"],"skill_level":standardlize_scores(q.details["est_theta"]),
                   "emotion":q.details["AI"],"question_details":q_data,"quiz_type":quiz_type}       
        quiz_template.append({q.quiz_id:details})
    result = {stuid:{"skill_level":standardlize_scores(cur_skill_level),"pre_skill_level":standardlize_scores(pre_skill_level),"strong_areas":strong_area,"improvements":improvements,"current_class_rank":current_rank,"prev_class_rank":pre_rank,"quiz":quiz_template,"image":iqz[0].details["student_info"]["student_portrait"],"recommendation":recommend}}      
    return jsonify(result)
    
test_api = Blueprint("test",__name__)
@test_api.route("/test",methods=['GET'])
def testing():
    # global is_updated
    # is_updated =True
    time1 = 1580357823.457036
    time2 = 1580357813.302164
    student_id = "ivanyew"
    results = Results.query.filter(Results.student_id==student_id,Results.time_stamp<time1,Results.time_stamp>time2).all()
    print(len(results))
    return jsonify({"msg":"success updated"})
    # return jsonify({"msg":"success updated"})


distraction_api = Blueprint('distraction',__name__)
@distraction_api.route('/distraction',methods=['POST'])
def distraction():
    if request.method == "POST":
        # get the img
        img = None
        image_type = request.form['image_type']
        if image_type == "file":
            img = cv2.imdecode(np.fromstring(request.files['image'].read(), np.uint8), cv2.IMREAD_UNCHANGED)
        elif image_type == "base64":
            base64 = request.form['image']
            img = decode(base64)

        try:
            # using hard coded distraction model.
            # msg = easy_defined_distraction(img)
            # using the engagement model.
            ana = analysis(emotion_model,detector,eye_predictor,faceCascade)
            msg = ana.detect_face(img)
        except:
            msg = "lost"
        try:
            # print("** captured time **" + str(request.form["timestamp"]))
            recording_ai(msg,request.form["timestamp"],"distraction",request.form["id"])
        except:
            print("testing distraction")
        return jsonify({'status':msg})

