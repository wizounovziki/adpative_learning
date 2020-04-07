import React, { useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import QuestionAvatar from '../SharedComponents/QuestionAvatar';
import QuestionDetails from '../SharedComponents/QuestionDetails';

function getQuestionObject(studentObject) {

  let questionArray = [];

  for (let i = 0; i < studentObject.details.question_details.length; i++) {
    let question = {
      id: studentObject.details.administered_items[i],
      question: studentObject.details.question_details[i].data.question,
      difficultyRating: studentObject.details.difficulties[i],
      options: [
        { letter: "A", ans: studentObject.details.question_details[i].data.A},
        { letter: "B", ans: studentObject.details.question_details[i].data.B},
        { letter: "C", ans: studentObject.details.question_details[i].data.C},
        { letter: "D", ans: studentObject.details.question_details[i].data.D}
      ],
      correctAns: studentObject.details.question_details[i].data.answer,
      studentAns: studentObject.details.submitted_answer[i],
      studentRespTime: studentObject.details.response_time[i],
      studentRespEmotion: studentObject.details.AI[i]
    }
    questionArray.push(question);
  }
  return questionArray
}


function QuestionDisplay(props) {

  const qnsList = getQuestionObject(props.student);
  // console.log(qnsList);

  const [qnsNo, setQnsNo] = useState(0)

  function changeQnsNo(event, newQnsNo) {
    setQnsNo(newQnsNo);
  }

  return (<div>
    <Tabs value={qnsNo} onChange={changeQnsNo} variant="scrollable" scrollButtons="desktop" indicatorColor="none">
      {qnsList.map((qns, index) => {
        return (
          <Tab key={qns.id} label={
            <QuestionAvatar
              num={index}
              isSelected={qnsNo === index}
              difficultyRating={qns.difficultyRating}
              respTime={qns.studentRespTime}
              respEmotion={qns.studentRespEmotion}
              mapColor={props.mapColor} />}>
          </Tab>
        )
      })}
    </Tabs>
    {qnsList.map((qns, index) => {
      return (
        <QuestionDetails
          key={qns.id}
          num={index}
          qnsNo={qnsNo}
          qns={qns.question}
          options={qns.options}
          correctAns={qns.correctAns}
          studentAns={qns.studentAns}
        />
      )
    })}
  </div>)
}

export default QuestionDisplay;