import { Checkbox } from "@carbon/react";

export const sourceList = [
    { key: 'Name', value: 'requirements.txt' },
    { key: 'Type', value: 'Gitlab - File' },
    { key: 'Component', value: 'Gitlab component 1' },
    { key: 'Stream', value: 'main' },
    { key: 'Baseline', value: 'c865083' },
];
// dropdown items
export const linkTypeItems = ['affectedBy', 'implementedBy', 'trackedBy', 'constrainedBy', 'decomposedBy', 'elaboratedBy', 'satisfiedBy'];

export const projectItems = ['Jira OSLC API 1', 'Glide OSLC API f1',];

export const resourceItems = ['User story', 'Task', 'Epic', 'Bug', 'Improvement',];

// target table 
export const headers = [
    { key: 'identifier', header: 'Identifier' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'checkbox', header: <Checkbox labelText='' id='' /> }
];

// document data
export const docData = [
    {
        identifier: 'DOC -106',
        name: 'Document-example 106',
        description: 'Document 106 description',
    },
    {
        identifier: 'DOC -195',
        name: 'Document-example 195',
        description: 'Document 195 description',
    },
    {
        identifier: 'DOC -406',
        name: 'Document-example 406',
        description: 'Document 406 description',
    },
    {
        identifier: 'DOC -476',
        name: 'Document-example 476',
        description: 'Document 476 description',
    },
    {
        identifier: 'DOC -499',
        name: 'Document-example 499',
        description: 'Document 499 description',
    },
    {
        identifier: 'DOC -500',
        name: 'Document-example 500',
        description: 'Document 500 description',
    },
    {
        identifier: 'DOC -600',
        name: 'Document-example 600',
        description: 'Document 600 description',
    },
];
// document data
export const data = [
    {
        identifier: 'US-103',
        name: 'Document-example 103',
        description: 'Document 103 description',
    },
    {
        identifier: 'US-193',
        name: 'Document-example 193',
        description: 'Document 193 description',
    },
    {
        identifier: 'US-420',
        name: 'Document-example 420',
        description: 'Document 420 description',
    },
    {
        identifier: 'US-303',
        name: 'Document-example 303',
        description: 'Document 303 description',
    },
    {
        identifier: 'US-305',
        name: 'Document-example 305',
        description: 'Document 305 description',
    },
    {
        identifier: 'US-410',
        name: 'Document-example 410',
        description: 'Document 410 description',
    },
    {
        identifier: 'US-535',
        name: 'Document-example 535',
        description: 'Document 535 description',
    },
];