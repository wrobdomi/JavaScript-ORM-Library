var logColor = 'color: #701ce6; font-size: 16px;';

// Metadata mapping classes - [DataMap design pattern] ------------------------------------ //
class MetaDataMap {
    constructor(className, tableName){
        this.className = className;     // name of the class
        this.tableName = tableName;     // table for the class
        this.columnsMaps = new Array(); // field -> column mapping
        this.relations = new Array();   // relation to other tables
    }

    addColumn(col){
        this.columnsMaps.push(col);
    }

    addRelation(rel){
        this.relations.push(rel);
    }

    // get column name for a passed field of the class
    getTableFieldName(classFieldName) {
        for(let cm of this.columnsMaps){
            if(cm.propertyName === classFieldName){
                return cm.columnName;
            }
        }

        return 'Error MetaDataMap: Mapping not found';
    }
}

// Metadata mapping classes - ColumnMap
class ColumnMap {
    constructor(propertyName, columnName, dbType) {
        this.propertyName = propertyName;   // class field name 
        this.columnName = columnName;       // db column name for the field     
        this.dbType = dbType;               // db type
    }
}

// Table relations
class Relation {
    constructor(rType, fieldName, className, foreignKeyField, primaryKeyField){
        this.relationType = rType;              // 'OneToMany' or 'ManyToMany'
        this.fieldName = fieldName;             // The field that contains object or many objects from other table
        this.className = className;             // name of the class from other table
        this.foreignKeyField = foreignKeyField; // name of the class field which is foreign key (from the other class) 
        this.primaryKeyField = primaryKeyField; // name of the class field which is primary key (from this class)
    }
}

// --------------------------------------------------------------------------------------- //




// Transfering data class - [DataMapper design pattern] ---------------------------------- //
class DataMapper {

    constructor() {
        this.map = new Map();
    }

    registerMetaDataMap(className, metaDataMap) {
        this.map.set(className, metaDataMap);
        this.createTable(metaDataMap);
    }


    createTable(metaDataMap) {
        
        // alasql("CREATE TABLE people (person_id number, person_name string, person_age number)");

        let qb = new QueryBuilder();
        qb.appendFragment('CREATE TABLE ');
        qb.appendFragment(metaDataMap.tableName);
        qb.appendFragment(' (');

        for (let i = 0; i < metaDataMap.columnsMaps.length; i++) {

            qb.appendFragment(metaDataMap.columnsMaps[i].columnName);
            qb.appendFragment(' ');
            qb.appendFragment(metaDataMap.columnsMaps[i].dbType);

            if(i === metaDataMap.columnsMaps.length-1){
                qb.appendFragment(')');
            } else {
                qb.appendFragment(', ');
            }
        } 

        // console.log(qb.getFullQuery());
        var dbSuccess = alasql(qb.getFullQuery());
        console.log('%c LIBRARY-LOG: Library creates new table by executing:', logColor);
        console.log('%c LIBRARY-LOG: ' + qb.getFullQuery(), logColor);
        console.log('%c LIBRARY-LOG: with result: ' + dbSuccess, logColor);

    }


    save(classObject) {

        const metaDataMapper = this.map.get(classObject.constructor.name);
        let qb = new QueryBuilder();
        qb.appendFragment('INSERT INTO ');
        qb.appendFragment(metaDataMapper.tableName);
        qb.appendFragment(' (');
        for (let i = 0; i < metaDataMapper.columnsMaps.length; i++) {
            qb.appendFragment(metaDataMapper.columnsMaps[i].columnName);
            if(i === metaDataMapper.columnsMaps.length-1){
                qb.appendFragment(')');
            } else {
                qb.appendFragment(', ');
            }
        } 

        qb.appendFragment(' VALUES (');
        for (let i = 0; i < metaDataMapper.columnsMaps.length; i++) {
            if (typeof classObject[metaDataMapper.columnsMaps[i].propertyName] === 'string' || 
                classObject[metaDataMapper.columnsMaps[i].propertyName] instanceof String) {
                qb.appendFragment("'");
                qb.appendFragment(classObject[metaDataMapper.columnsMaps[i].propertyName]);
                qb.appendFragment("'");
            }else {
                qb.appendFragment(classObject[metaDataMapper.columnsMaps[i].propertyName]);
            }
           
            if(i === metaDataMapper.columnsMaps.length-1){
                qb.appendFragment(')');
            } else {
                qb.appendFragment(', ');
            }
        } 
        

        var dbSuccess = alasql(qb.getFullQuery());
        console.log('%c LIBRARY-LOG: Library saves object by executing:', logColor);
        console.log('%c LIBRARY-LOG: ' + qb.getFullQuery(), logColor);
        console.log('%c LIBRARY-LOG: with result: ' + dbSuccess, logColor);

        // if relations array exist and is not empty
        if(Array.isArray(metaDataMapper.relations) && metaDataMapper.relations.length){
            
            for(let singleRel of metaDataMapper.relations){

                if(singleRel.relationType === 'OneToOne'){
                    console.log(classObject[singleRel.fieldName]);
                    this.save(classObject[singleRel.fieldName]);
                }

                if(singleRel.relationType === 'OneToMany'){
                    for(let arrElement of classObject[singleRel.fieldName]){
                        this.save(arrElement);
                    }
                }

            }

        }

    }

    getAll(className) {
        const metaDataMapper = this.map.get(className);
        let qb = new QueryBuilder();
        qb.appendFragment('SELECT * FROM ');
        qb.appendFragment(this.map.get(className).tableName);

     
        let dbClassObjects = alasql(qb.getFullQuery());

        console.log('%c LIBRARY-LOG: Library gets all data from table by executing:', logColor);
        console.log('%c LIBRARY-LOG: ' + qb.getFullQuery(), logColor);
        // console.log('%c LIBRARY-LOG: with result: ' + dbClassObjects, logColor);
        console.log('%c LIBRARY-LOG: library converts data to class objects... ', logColor);

        let allClassObjects = new Array();
        
        for(let dbObject of dbClassObjects){
           let object = new Object(); 
           for(let cMap of this.map.get(className).columnsMaps){
               object[cMap.propertyName] = dbObject[cMap.columnName];
           }
           allClassObjects.push(object)
        }


        // if class has relations with other tables
         if(Array.isArray(metaDataMapper.relations) && metaDataMapper.relations.length){
             for(let singleRelation of metaDataMapper.relations){

                if(singleRelation.relationType === 'OneToOne'){
                    let allRelationObjects = new Array();    
                    allRelationObjects = this.getAll(singleRelation.className);
                    for(let j of allClassObjects) {
                        for(let i of allRelationObjects) {
                            if(i[singleRelation.foreignKeyField] === j[singleRelation.primaryKeyField]){
                                j[singleRelation.fieldName] = i;
                            }
                        }
                    }
                }

                if(singleRelation.relationType === 'OneToMany'){
                    let allRelationObjects = new Array();    
                    allRelationObjects = this.getAll(singleRelation.className);
                    for(let j of allClassObjects) {
                        for(let i of allRelationObjects) {
                            if(i[singleRelation.foreignKeyField] === j[singleRelation.primaryKeyField]){
                                console.log('Single relatio field name is ' + singleRelation.fieldName);
                                
                                if(Array.isArray(j[singleRelation.fieldName])){
                                    j[singleRelation.fieldName].push(i);
                                } else{
                                    j[singleRelation.fieldName] = new Array();
                                    j[singleRelation.fieldName].push(i);
                                }     
                            }
                        }
                    }
                }


             }
         }

        return allClassObjects;
    }

    getByCriteria(className, queryObject) {
        const metaDataMapper = this.map.get(className);
        let qb = new QueryBuilder();
        qb.appendFragment('SELECT * FROM ');
        qb.appendFragment(this.map.get(className).tableName);
        qb.appendFragment(queryObject.getSpecificQuery());

        let dbClassObjects = alasql(qb.getFullQuery());
     
        console.log('%c LIBRARY-LOG: Library gets all data from table by executing:', logColor);
        console.log('%c LIBRARY-LOG: ' + qb.getFullQuery(), logColor);
        // console.log('%c LIBRARY-LOG: with result: ' + dbClassObjects, logColor);
        console.log('%c LIBRARY-LOG: library converts data to class objects... ', logColor);
        
        let allClassObjects = new Array();
        
        for(let dbObject of dbClassObjects){
           let object = new Object(); 
           for(let cMap of this.map.get(className).columnsMaps){
               object[cMap.propertyName] = dbObject[cMap.columnName];
           }
           allClassObjects.push(object)
        }


        // if class has relations with other tables
         if(Array.isArray(metaDataMapper.relations) && metaDataMapper.relations.length){
             for(let singleRelation of metaDataMapper.relations){

                if(singleRelation.relationType === 'OneToOne'){
                    let allRelationObjects = new Array();    
                    allRelationObjects = this.getAll(singleRelation.className);
                    for(let j of allClassObjects) {
                        for(let i of allRelationObjects) {
                            if(i[singleRelation.foreignKeyField] === j[singleRelation.primaryKeyField]){
                                j[singleRelation.fieldName] = i;
                            }
                        }
                    }
                }

                if(singleRelation.relationType === 'OneToMany'){
                    let allRelationObjects = new Array();    
                    allRelationObjects = this.getAll(singleRelation.className);
                    for(let j of allClassObjects) {
                        for(let i of allRelationObjects) {
                            if(i[singleRelation.foreignKeyField] === j[singleRelation.primaryKeyField]){
                                console.log('Single relatio field name is ' + singleRelation.fieldName);
                                
                                if(Array.isArray(j[singleRelation.fieldName])){
                                    j[singleRelation.fieldName].push(i);
                                } else{
                                    j[singleRelation.fieldName] = new Array();
                                    j[singleRelation.fieldName].push(i);
                                }     
                            }
                        }
                    }
                }


             }
         }


        return allClassObjects;
    }

    update(className, queryObject, setFieldsArray, setValuesArray) {
        const metaDataMapper = this.map.get(className);
        let qb = new QueryBuilder();
        qb.appendFragment('UPDATE ');
        qb.appendFragment(metaDataMapper.tableName);
        qb.appendFragment(' SET ');
        for(let i = 0; i < setFieldsArray.length; i++){

            for (let j = 0; j < metaDataMapper.columnsMaps.length; j++) {
                if(setFieldsArray[i] === metaDataMapper.columnsMaps[j].propertyName){

                    qb.appendFragment(metaDataMapper.columnsMaps[j].columnName);
                    qb.appendFragment(' = ');
                    
                    if (typeof setValuesArray[i] === 'string' || setValuesArray[i] instanceof String) {
                        qb.appendFragment("'");
                        qb.appendFragment(setValuesArray[i]);
                        qb.appendFragment("'");
                    }else {
                        qb.appendFragment(setValuesArray[i]);
                    }

                    if(i === setFieldsArray.length - 1){
                        qb.appendFragment(' ');
                    }
                    else{
                        qb.appendFragment(', ');
                    }

                }
           
            } 
        }

        qb.appendFragment(queryObject.getSpecificQuery())
        let dbQuery = qb.getFullQuery();
        alasql(dbQuery);

        console.log('%c LIBRARY-LOG: Library updates record by executing:', logColor);
        console.log('%c LIBRARY-LOG: ' + qb.getFullQuery(), logColor);
    }

    delete(className, queryObject) {
        const metaDataMapper = this.map.get(className);
        let qb = new QueryBuilder();
        qb.appendFragment('DELETE FROM ');
        qb.appendFragment(metaDataMapper.tableName);
        qb.appendFragment('  ');
        qb.appendFragment(queryObject.getSpecificQuery())
        let dbQuery = qb.getFullQuery();
        alasql(dbQuery);

        console.log('%c LIBRARY-LOG: Library deletes record by executing:', logColor);
        console.log('%c LIBRARY-LOG: ' + qb.getFullQuery(), logColor);
    }

}
// ------------------------------------------------------------------------------------- //





// Specify query - [QueryObject design pattern] --------------------------------------------- //
class QueryObject {
    constructor(){
        this.metaDataMapObject = null;
        this.criteriaArray = new Array();
    }

    addCriteria(newCriteria){
        this.criteriaArray.push(newCriteria);
    }

    setMetaDataMapping(metaMap) {
        this.metaDataMapObject = metaMap;
    }

    getSpecificQuery() {
        if(this.metaDataMapObject === null){
            return 'Error QueryObject: metaDataMapObject must be set';
        }
        let qb = new QueryBuilder();
        qb.appendFragment(' WHERE ');
        for(let i = 0; i < this.criteriaArray.length; i++){
            qb.appendFragment(this.metaDataMapObject.getTableFieldName(this.criteriaArray[i].classField));
            qb.appendFragment(' ');
            qb.appendFragment(this.criteriaArray[i].operator)
            qb.appendFragment(' ');

            if (typeof this.criteriaArray[i].value === 'string' || 
                this.criteriaArray[i].value instanceof String) {
                qb.appendFragment("'");
                qb.appendFragment(this.criteriaArray[i].value);
                qb.appendFragment("'");
            }else {
                 qb.appendFragment(this.criteriaArray[i].value);
            }


            if(i === this.criteriaArray.length-1){
                qb.appendFragment(' ');
            }else{
                qb.appendFragment(' AND ');
            }
        }

        // console.log(qb.getFullQuery());
        return qb.getFullQuery();
    }
}

class Criteria {
    constructor(operator, classField, value){
        this.operator = operator;
        this.classField = classField;
        this.value = value;
    }
}
// ------------------------------------------------------------------------------------- //





// Helper class - [Builder design pattern] ---------------------------------------------- //
class QueryBuilder{
    constructor(){
        this.query = "";
    }

    appendFragment(queryPart){
        this.query = this.query + queryPart;
    }

    getFullQuery(){
        return this.query;
    }
}
// ------------------------------------------------------------------------------------- //
