function processConfigForm(object) {
    if(!object.base_url){ return "!base_url" }
    if(!object.username){ return "!username" }
    if(!object.password){ return "!password" }
    
    properties.setBaseUrl (object.base_url);
    properties.setUsername(object.username);
    properties.setPassword(object.password);
    return true
  }
  
  function feachConfigForm() {
    return {
      "base_url": properties.getBaseUrl (),
      "username": properties.getUsername()
    }
  }
  
  function processEditForm(object) {
    if(!object.query_id){ return "!query_id" }
    if(!object.name){ return "!name" }
    if(!object.sheet){ return "!sheet" }
  
    query = {
      "id": object.query_id,
      "name": object.name,
      "sheet": object.sheet,
      "range": object.range,
      "parameters": []
    }
  
    const parameters = JSON.parse(object.parameters || '[]');
    for(let i = 0; i < parameters.length; i++){
      let parameter = parameters[i];
      parameter.value = object[parameter.target]
      query.parameters.push(parameter);
    }
    
    properties.setQuery(query);
    return true
  }
  
  function feachEditForm(id) {
    return properties.getQuery(id)
  }
  
  function feachQueries() {
    return properties.getQueries()
  }
  
  function feachQueryDetails(id) {
    return Core.getQuestionDetailsSimplified(id);
  }
  
  function clean(){
    properties.setQueries([])
  }
  
  function executeQuery(id) {
    let query = properties.getQuery(id || 6779);
    return Core.getQuestionAndFillSheet(query);
  }