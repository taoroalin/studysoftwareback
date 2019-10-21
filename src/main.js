const neo4j = require('neo4j-driver').v1;
const env = require('./env.js');

class Api{
  constructor(){
    this.driver = neo4j.driver(env.database, neo4j.auth.basic(env.user, env.password));
    this.session = this.driver.session();
  }

  createNoteRelation(node){
    let relationList='';
    for(let i=0; i<node.relations.length; i++){
      relationList+= `,(a)-[:${node.relations[i].type}]->(:${node.relations[i].subject})`
    }
    let create = `CREATE (a:Note {definition:$definition, title:$title, notes:$notes})${relationList}RETURN a`;
    console.log(create);
    let createPromise=this.session.run(
      create,
      node);
    createPromise.then(result=>{
      this.session.close();

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
    
      console.log(node.properties);
    
      // on application exit:
      this.driver.close();
    });
  }
}

const api = new Api();
api.createNoteRelation({title:'ut', definition:'ud', notes:'un', relations:[{type:'causes', subject:'miri'}]});