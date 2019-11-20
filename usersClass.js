// User defined class

// Single object example
// Person < ---- > Database
class Person {
    constructor(id, name, age){
        this.id = id;
        this.name = name;
        this.age = age;
    }
}

// OneToOne relation example
// Every Student has one StudentCard
// Student, StudentCard < ----- > Database

class Student {
    constructor(id, name, surname, age, studentCard){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.studentCard = studentCard;
    }
}

class StudentCard {
    constructor(studentId, studentNumber, faculty){
        this.studentId = studentId;
        this.studentNumber = studentNumber;
        this.faculty = faculty;
    }
}


// OneToMany relation example
// Every Country has one or more cities

class Country {
    constructor(id, name, cities){
        this.id = id;
        this.name = name;
        this.cities = cities;
    }
}

class City {
    constructor(countryId, cityId, name, numberOfPeople){
        this.countryId = countryId;
        this.cityId = cityId;
        this.name = name;
        this.numberOfPeople = numberOfPeople;
    }
}