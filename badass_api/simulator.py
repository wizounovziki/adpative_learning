import requests
import random
import time
import json

header={'Content-Type':'application/json','Connection':"close"}
base_url = 'http://127.0.0.1:7777/adaptivetest'

def start_quiz(stuid,quiz_id):
    command = "new"
    method = "IRT"
    id = stuid
    quiz_id = quiz_id
    body = {
        "id":id,
        "command":command,
        "method":method,
        "quiz_id":quiz_id
    }
    r = requests.post(base_url,data = json.dumps(body),headers=header,timeout=100000)
    print("quiz start.")
    return r

def end_quiz(r):
    command = "end"
    id = dict(r.json())["id"]
    session_id = dict(r.json())["session_id"]
    body = {
        "id":id,
        "command":command,
        "session_id":session_id
    }
    r = requests.post(base_url,data = json.dumps(body),headers=header,timeout=100000)
    print("quiz end.")
    return r

def get_next(r):
    id = dict(r.json())["id"]
    session_id = dict(r.json())["session_id"]
    command = "next"
    body = {
        "id":id,
        "command":command,
        "session_id":session_id
    }
    r = requests.post(base_url,data = json.dumps(body),headers=header,timeout=100000)
    print("next question.")
    return r

def submit_answer(r,answer):
    id = dict(r.json())["id"]
    session_id = dict(r.json())["session_id"]
    question_id = dict(r.json())["question_id"]
    ans  = answer
    command = "answer"
    body = {
        "id":id,
        "session_id":session_id,
        "command":command,
        "chosen_answer":ans,
        "question_id":question_id
    }
    r = requests.post(base_url,data = json.dumps(body),headers=header,timeout=100000)
    print("question answered.")
    return r

def take_exam(stuid,qid):
    student_id = stuid
    quiz_id = qid
    problem_num = 10
    options = ["A","B","C","D"]
    # hard coded quiz_info
    start_response = start_quiz(student_id,quiz_id)

    roll = random.randint(0,1)

    if roll == 1:
        # random answer
        for i in range(0,problem_num):
            answer_res = get_next(start_response)
            ans = options[random.randint(0,3)]
            time.sleep(random.randint(2,5))
            r = submit_answer(answer_res,ans)
    
    if roll == 0:
        # all correct answer
        for i in range(0,problem_num):
            answer_res = get_next(start_response)
            ans = str(dict(answer_res.json())["correct_answer"])
            time.sleep(random.randint(2,5))
            r = submit_answer(answer_res,ans)

    # for i in range(0,problem_num):
    #     answer_res = get_next(start_response)
    #     ans = "F"
    #     time.sleep(random.randint(2,5))
    #     r = submit_answer(answer_res,ans)

    end_msg = end_quiz(start_response)

def demo_users():
    student_list = ["Alice","Bob","Charles"]
    student_num=3
    quiz_num = 2
    q_start_num=1
    for i in range(q_start_num,q_start_num+quiz_num):
        quiz_id = "quiz_"+str(i)
        for j in range(0,student_num):
            student_id = student_list[j]
            take_exam(student_id,quiz_id)
            print(student_id+" finished "+quiz_id)
        print("all finished "+quiz_id)
    

if __name__ == "__main__":
    # student_num = 1
    # quiz_num = 1
    # q_start_num = 1
    # for i in range(q_start_num,q_start_num+quiz_num):
    #     quiz_id = "quiz_"+str(i)
    #     for j in range(1,student_num+1):
    #         student_id = "student"+str(j)
    #         take_exam(student_id,quiz_id)
    #         print(student_id+" finished "+quiz_id)
    #     print("all finished "+quiz_id)
    demo_users()
    
