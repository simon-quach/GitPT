function extractNameAndProject(url){
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
   
    if (match ){
        const namee = match[1];
        const project = match[2];
        
        return {
        namee,
        project
        };
    } else {
        throw new Error('Invalid Github URL');
    }
}

module.exports = extractNameAndProject;