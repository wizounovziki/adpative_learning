#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from flask import Flask, escape,request,jsonify,session
import datetime
import json
import datetime
import secrets


# In[ ]:


import adaptive_test as adt


# In[ ]:


adt_test = adt.adaptiveTest(items='../data/Math/P1-2_processed.csv')
# adt_test.register_examinee('123','sdfasdfss')


# In[ ]:


# Flask server
app = Flask(__name__)
app.config['SECRET_KEY'] = 'top_secret123xxxyyy'
app.config['PERMANENT_SESSION_LIFETIME'] =  datetime.timedelta(minutes=10)


# In[ ]:



@app.route('/adaptivetest',methods=['GET','POST'])
def adaptive_test():
    if request.method=='POST':
        input_data = request.get_json()
        
        # register student for test session
        if input_data['command']=='new':
            if str(input_data['id']) in session:
                return jsonify({'id':input_data['id'],
                                'status' : 'session_error',
                                'message' : 'id already exist'
                               })
            
            temp = secrets.token_hex()
            status = adt_test.register_examinee(str(input_data['id']),temp)
            print(adt_test.active_examinees)
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
                        print('Session timeout & force removed')
                    print(adt_test.active_examinees)
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
            status = adt_test.remove_examinee(input_data['id'],input_data['session_id'])
            print(adt_test.active_examinees)
            if status:
                del session[input_data['id']]
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
            question = adt_test.get_question_index(input_data['id'],input_data['session_id'])
            print(adt_test.active_examinees)
            if question:
                if question==-1:
                    return jsonify({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'status' : 'quiz_error',
                                'message' : 'submit answer first'
                               })
                else:
                    return json.dumps({'id':input_data['id'],
                                    'session_id': input_data['session_id'],
                                    'question_id': str(question['ID']),
                                    'question': question['Question'],
                                    'choices': {item:question[item] for item in ['A','B','C','D']},
                                    'correct_answer': question['Answer'],
                                    'status' : 'quiz_question',
                                   })
            else:
                return jsonify({'id':input_data['id'],
                                'session_id': input_data['session_id'],
                                'status' : 'quiz_end'
                               })
            
        elif input_data['command']=='answer':
            status = adt_test.update_response(input_data['id'],input_data['session_id'],input_data['chosen_answer'])
            print(adt_test.active_examinees)
            if status:
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
                
            
            


# In[ ]:


if __name__ == '__main__':
    app.run()

