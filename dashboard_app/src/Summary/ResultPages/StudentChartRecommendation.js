import React from 'react'


function StudentChartRecommendation({data}) {

    console.log("Data in Student Recommendation Chart", data)
    return (
        <div>
            <h1>Recommendation :</h1>
            <p>{data.recommendation}</p>

        </div>
    )
}

export default StudentChartRecommendation
