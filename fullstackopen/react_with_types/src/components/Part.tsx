import React from 'react'
import { CourseNormalPart, CoursePart, CoursePartWithDescription, CoursePartWithRequirements, CourseProjectPart, CourseSubmissionPart } from '../types/types'

interface PartProps {
    coursePart: CoursePart;
}

const Part = (props: PartProps) => {
    const coursePart = props.coursePart;
    //const description = props.coursePart.description ? 
    let description = null;
    let url = null;
    let groupProjectCount = null;
    let requirements = null;
    switch (coursePart.type) {
        case ("normal"):
            description = (coursePart as CourseNormalPart).description;
            break;
        case ("groupProject"):
            groupProjectCount = (coursePart as CourseProjectPart).groupProjectCount;
            break;
        case ("submission"):
            description = coursePart.description;//(coursePart as CourseSubmissionPart).description;
            url = coursePart.exerciseSubmissionLink;
            break;
        case ("special"):
            description = (coursePart as CoursePartWithRequirements).description;
            requirements = (coursePart as CoursePartWithRequirements).requirements;
            break;
        default:
            throw new Error(
                `Unhandled discriminated union member: ${JSON.stringify(coursePart)}`
            );
    }

    return (
        <div>
            <h3>{props.coursePart.name} {props.coursePart.exerciseCount}</h3>
            {description && <div style={{ color: "red" }}>{description}</div>}
            {groupProjectCount && <div>project exercises {groupProjectCount}</div>}
            {url && <div style={{ color: "blue" }}>submit to {url}</div>}
            {requirements && <div>required skills: {requirements.join(', ')}</div>}
        </div>
    )
}

export default Part;