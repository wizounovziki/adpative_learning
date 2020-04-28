//This utility returns hex colors. 

//This function is used for emotion coded coloring
//This function is used for the selection of saturated colours
// export function emoColor(emotionString) {
//   switch (emotionString) {
//     case 'happy':
//       return '#AC6DE3';
//     case 'normal':
//       return '#5BD8DE';
//     case 'distracted':
//       return '#CCD354';
//     case 'tired':
//       return '#FFAA5C';
//     case 'stressed':
//       return '#ED6767';
//     default:
//       return '#c0c0c0';
//   }
// }

//This function codes for emotion coded coloring
//This function is for the selection of faded colours
// export function emoColorFaded(emotionString) {
//   switch (emotionString) {
//     case 'happy':
//       return '#DCC5F0';
//     case 'normal':
//       return '#BFE2E3';
//     case 'distracted':
//       return '#E0E3B3';
//     case 'tired':
//       return '#FDE0C5';
//     case 'stressed':
//       return '#FAD2D2';
//     default:
//       return '#c0c0c0';
//   }
// }

//Colors used to tag emotion. Order depends on how they were supplied
export const colorArray = ['#AC6DE3', '#5BD8DE', '#CCD354', '#FFAA5C', '#ED6767', '#009933', '#ff9999', '#d9b38c', '#ccfff2', '#ffffcc']

export function createColorCode(tagArray) {
  if (tagArray.length > colorArray.length) {
    console.log('Error: not enough colours to select');
  }
  else {
    const colorObj = tagArray.map((tag, idx) => { return ({ "tag": tag, color: colorArray[idx] }) });

    function findColor(str) {
      let c = colorObj.find(item => item.tag === str);
      if (c === undefined) {
        return '#c0c0c0'
      }
      else {
        return c.color
      }
    }
    return findColor;
  }
}

//This function codes for the Left ,Right ,Center ,Closed, Lost
//This function is used for the selection of saturated colours
export function emoColor(emotionString) {
  switch (emotionString) {
    case 'distracted':
      return '#AC6DE3';
    case 'engaged':
      return '#CCD354';
    case 'lost':
      return '#FFAA5C';
    case 'neural':
      return '#5BD8DE'; 
    case 'Lost':
      return '#ED6767';
    default:
      return '#c0c0c0';
  }
}


//This function codes for the Left ,Right ,Center ,Closed, Lost
//This function is for the selection of faded colours
export function emoColorFaded(emotionString) {
  switch (emotionString) {
    case 'Left':
      return '#DCC5F0';
    case 'Right':
      return '#BFE2E3';
    case 'Center':
      return '#E0E3B3';
    case 'Closed':
      return '#FDE0C5';
    case 'Lost':
      return '#FAD2D2';
    default:
      return '#c0c0c0';
  }
}


//This function is used for difficulty coded coloring
//Difficulty rating is from 1 to 10
export function difficultyColor(difficultyInteger) {
  switch (difficultyInteger) {
    case 1:
      return '#260033';
    case 2:
      return '#4d0066';
    case 3:
      return '#730099';
    case 4:
      return '#9900cc';
    case 5:
      return '#bf00ff';
    case 6:
      return '#cc33ff';
    case 7:
      return '#d966ff';
    case 8:
      return '#e699ff';
    case 9:
      return '#f2ccff';
    case 10:
      return '#f9e6ff';
    default:
      return '#c0c0c0';
  }
}