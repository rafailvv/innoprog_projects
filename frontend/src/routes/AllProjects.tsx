import { useState } from 'react';
import ProjectRow from '../components/ProjectRow';


const projectsBoilerplate = [
    {
        name: "Разработка нейросети",
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium, officiis, ut nostrum incidunt nam rem porro nemo aspernatur, veniam deleniti optio ullam placeat? Ab quasi eveniet ex quae veritatis? Inventore?',
        studentsWork: 4,
        id:1
    },
    {
        name: "Поиск товаров",
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea laborum veritatis consectetur dolore! Omnis aliquid adipisci maiores nemo earum unde dolores, harum architecto hic voluptatibus, ad perspiciatis cumque, error aperiam.',
        studentsWork: 5,
        id:2
    },
    {
        name: "Разработка другой нейросети",
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium, officiis, ut nostrum incidunt nam rem porro nemo aspernatur, veniam deleniti optio ullam placeat? Ab quasi eveniet ex quae veritatis? Inventore?',
        studentsWork: 3,
        id:3
    },
]

function AllProjects() {
    const [hotProjects] = useState(projectsBoilerplate);
    const [doneProjects] = useState(projectsBoilerplate);
    const [inProcessProjects] = useState(projectsBoilerplate);
    return (
        <>
            <ProjectRow projects={hotProjects} name='Hot Projects'/>
            <ProjectRow projects={doneProjects} name='Done Projects'/>
            <ProjectRow projects={inProcessProjects} name='In Process'/>
        </>
    )
}

export default AllProjects;