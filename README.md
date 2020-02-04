# JavaScript-ORM-Library
JS ORM library built with design patterns: MetaDataMapping, DataMapper, QueryObject.

Library file: metamap.js

# Technologies
  + JavaScript ES6
  + AlaSQL.js
  
# Code sample
  + Single object
  
    ![01](https://user-images.githubusercontent.com/37666186/73739556-bd73ff00-4746-11ea-8db0-ed19381827c8.PNG)
    - Create person and configure metadata
    ```javascript
      var person1 = new Person(1, 'John', 26);

      var personDataMap = new MetaDataMap('Person', 'people');
      personDataMap.addColumn(new ColumnMap('id', 'person_id', 'number'));
      personDataMap.addColumn(new ColumnMap('name', 'person_name', 'string'));
      personDataMap.addColumn(new ColumnMap('age', 'person_age', 'number'));
      ```
    - Create context object and register your configuration
    ```javascript
      var dataMapper = new DataMapper();
      dataMapper.registerMetaDataMap("Person", personDataMap);
    ```
    - Use library code to perform SQL queries in a simple way
    ```javascript
      // ^*^*^* save object in DB
      dataMapper.save(person1);
      
      // ^*^*^* get all people from DB
      allPeople1 = dataMapper.getAll("Person");

      // ^*^*^* get specific person from DB
      var qo1 = new QueryObject();
      qo1.setMetaDataMapping(personDataMap);
      qo1.addCriteria(new Criteria('=', 'name', 'John'));
      qo1.addCriteria(new Criteria('<', 'age', 50));
      var specificPeople1 = dataMapper.getByCriteria("Person", qo1);

      // ^*^*^* update 
      var qo2 = new QueryObject();
      qo2.setMetaDataMapping(personDataMap);
      qo2.addCriteria(new Criteria('LIKE', 'name', 'J%'));
      dataMapper.update("Person", qo2, ['age'], [20]);
      var updateResult = dataMapper.getByCriteria("Person", qo2);

      // ^*^*^* delete
      var qo3 = new QueryObject();
      qo3.setMetaDataMapping(personDataMap);
      qo3.addCriteria(new Criteria('LIKE', 'name', 'M%'));
      dataMapper.delete("Person", qo3);
    ```
