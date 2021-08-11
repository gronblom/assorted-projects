import React from 'react'
import { CoursePart } from '../types/types'
import Part from './Part'

interface ContentProps {
    courseParts: Array<CoursePart>
}

const Content = (props: ContentProps) => {

    return (
        <div>
            {props.courseParts.map(course =>
                <Part key={course.name} coursePart={course}/>
            )}
        </div>
    )
}

export default Content;