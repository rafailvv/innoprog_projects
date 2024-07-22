import { useEffect, useState } from 'react';
import ProjectRow from '../components/ProjectRow';
import { getProfile, getProjects, getUserProjects } from '../services/api';

// const projectsBoilerplate = [
//     {
//         name: "Разработка нейросети",
//         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium, officiis, ut nostrum incidunt nam rem porro nemo aspernatur, veniam deleniti optio ullam placeat? Ab quasi eveniet ex quae veritatis? Inventore?',
//         studentsWork: 4,
//         id:1
//     },
//     {
//         name: "Поиск товаров",
//         description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea laborum veritatis consectetur dolore! Omnis aliquid adipisci maiores nemo earum unde dolores, harum architecto hic voluptatibus, ad perspiciatis cumque, error aperiam.',
//         studentsWork: 5,
//         id:2
//     },
//     {
//         name: "Разработка другой нейросети",
//         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium, officiis, ut nostrum incidunt nam rem porro nemo aspernatur, veniam deleniti optio ullam placeat? Ab quasi eveniet ex quae veritatis? Inventore?',
//         studentsWork: 3,
//         id:3
//     },
// ]

function AllProjects() {
    // const [hotProjects] = useState(projectsBoilerplate);
    // const [doneProjects] = useState(projectsBoilerplate);
    // const [inProcessProjects] = useState(projectsBoilerplate);
    const [allProjects, setAllProjects] = useState([]);


    // const [cookies, setCookie] = useCookies(['sessionid']);

    // console.log("wtf"+document.cookie)

    useEffect(() => {
            getProjects().then(response => response.json()).then(data => {
                console.log(data);
                setAllProjects(data);
            });
            getUserProjects().then(response => response.json()).then(data => {
                console.log(data)
            })
            getProfile(document.cookie).then(response => response.json()).then(data => {
                console.log(data)
            })
    }, [])
    return (
        <>
            <ProjectRow projects={allProjects} name='Hot Projects'/>
            {/* <ProjectRow projects={doneProjects} name='Done Projects'/>
            <ProjectRow projects={inProcessProjects} name='In Process'/> */}
        </>
    )
}

export default AllProjects;