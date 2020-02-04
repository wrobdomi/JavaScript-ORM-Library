# JavaScript-ORM-Library
JS ORM library built with design patterns: MetaDataMapping, DataMapper, QueryObject.

Library file: metamap.js

# Technologies
  + JavaScript ES6
  + AlaSQL.js
  
# Code samples
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
 + One-To-One
   
   ![02](https://user-images.githubusercontent.com/37666186/73740620-c9f95700-4748-11ea-92ac-e0151dfdd493.PNG)
      - Create students and cards
      
     ```javascript
      var student1Card = new StudentCard(1, 228512, 'EAIiB' )
      var student2Card = new StudentCard(2, 245621, 'WIET' )
      var student3Card = new StudentCard(3, 256123, 'WIMiR' )
      var student4Card = new StudentCard(4, 212312, 'WIMIP' )

      var student1 = new Student(1, 'Dominik', 'Wrobel', 23, student1Card);
      var student2 = new Student(2, 'Franek', 'Kopytko', 25, student2Card);
      var student3 = new Student(3, 'Zosia', 'Sosna', 26, student3Card);
      var student4 = new Student(4, 'Mirek', 'Misiak', 26, student4Card);
     ```
      
      - Configure metadata
      
     ```javascript
      var studentDataMap = new MetaDataMap('Student', 'students');
      studentDataMap.addColumn(new ColumnMap('id', 'student_id', 'number'));
      studentDataMap.addColumn(new ColumnMap('name', 'student_name', 'string'));
      studentDataMap.addColumn(new ColumnMap('surname', 'student_surname', 'string'));
      studentDataMap.addColumn(new ColumnMap('age', 'student_age', 'number'));

      var cardsDataMap = new MetaDataMap('StudentCard', 'cards');
      cardsDataMap.addColumn(new ColumnMap('studentId', 'student_id', 'number'));
      cardsDataMap.addColumn(new ColumnMap('studentNumber', 'student_number', 'number'));
      cardsDataMap.addColumn(new ColumnMap('faculty', 'student_faculty', 'string'));
      
      studentDataMap.addRelation(new Relation('OneToOne', 'studentCard', 'StudentCard', 'studentId', 'id'));
     ```
     
     - Create context object and register your configuration
    ```javascript
      var dataMapper = new DataMapper();
      dataMapper.registerMetaDataMap("Student", studentDataMap);
      dataMapper.registerMetaDataMap("StudentCard", cardsDataMap);
     ```
     
     - Save students and student card in two different tables: 
     ```javascript
      // ^*^*^* save object in DB
      dataMapper.save(student1);
      dataMapper.save(student2);
     ```
     
     - Get all students and their cards
     ```javascript
     // ^*^*^* get all students with their cards from DB
     allStudentsWithCards = dataMapper.getAll("Student");
     ```
     
+ One-To-Many

  ![03](https://user-images.githubusercontent.com/37666186/73741191-05e0ec00-474a-11ea-91eb-5b32508967e8.PNG)
  
    - Create countries and cities
    ```javascript
    var city1 = new City(1, 1, 'Krakow', 350000);
    var city2 = new City(1, 2, 'Warszawa', 500000);
    var city3 = new City(2, 3, 'London', 3000000);
    var city4 = new City(2, 4, 'Reading', 250000);
    var city5 = new City(3, 5, 'Berlin', 2000000);
    var city6 = new City(3, 6, 'Munich', 500000);
    var city7 = new City(4, 7, 'New York', 8000000);
    var city8 = new City(4, 8, 'Chicago', 3500000);
    var city9 = new City(4, 9, 'San Francisco', 2000000);
    var citiesOfPoland = new Array();
    citiesOfPoland.push(city1);
    citiesOfPoland.push(city2);
    var citiesOfUK = new Array();
    citiesOfUK.push(city3);
    citiesOfUK.push(city4);
    var citiesOfGermany = new Array();
    citiesOfGermany.push(city5);
    citiesOfGermany.push(city6);
    var citiesOfUSA = new Array();
    citiesOfUSA.push(city7);
    citiesOfUSA.push(city8);
    citiesOfUSA.push(city9);
    var countryPoland = new Country(1, 'Poland', citiesOfPoland);
    var countryUK = new Country(2, 'UK', citiesOfUK);
    var countryGermany = new Country(3, 'Germany', citiesOfGermany);
    var countryUSA = new Country(4, 'USA', citiesOfUSA);
    ```
    
    - Configure metadata
    ```javascript
    var countriesDataMap = new MetaDataMap('Country', 'countries');
    countriesDataMap.addColumn(new ColumnMap('id', 'country_id', 'number'));
    countriesDataMap.addColumn(new ColumnMap('name', 'country_name', 'string'));


    var citiesDataMap = new MetaDataMap('City', 'cities');
    citiesDataMap.addColumn(new ColumnMap('countryId', 'country_id', 'number'));
    citiesDataMap.addColumn(new ColumnMap('cityId', 'city_id', 'number'));
    citiesDataMap.addColumn(new ColumnMap('name', 'city_name', 'string'));
    citiesDataMap.addColumn(new ColumnMap('numberOfPeople', 'people', 'number'));

    // configure meta data for relations
    countriesDataMap.addRelation(new Relation('OneToMany', 'cities', 'City', 'countryId', 'id'));
    ```
    
    - Register metadata and  get context object
    ```javascript
        var dataMapper = new DataMapper();
    // register MetaDataMapping objects
    dataMapper.registerMetaDataMap("Country", countriesDataMap);
    dataMapper.registerMetaDataMap("City", citiesDataMap);
    ``` 
    
    - Save counry and all its cities in two different tables
    ```javascript
    // ^*^*^* save object in DB
    dataMapper.save(countryPoland);
    dataMapper.save(countryUK);
    dataMapper.save(countryGermany);
    dataMapper.save(countryUSA);
    ``` 
    
    - Get all countries and their cities from db
    ```javascript
    allCountriesWithCities = dataMapper.getAll("Country");
    ```
    - Get specific countries
    ```javascript
    var qo1 = new QueryObject();
    qo1.setMetaDataMapping(countriesDataMap);
    qo1.addCriteria(new Criteria('LIKE', 'name', 'U%'));
    
    var specificCountries = dataMapper.getByCriteria("Country", qo1);
    ```
    
