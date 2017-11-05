"use strict";
const expect = require('chai').expect;
const PocketRegistry = require('../');

describe('PocketRegistry', function () {
    let testRegistry;

    beforeEach(function () {
        testRegistry = new PocketRegistry();
    });

    it('can set, check if exists and return various types', function () {
        const testObject = {
            foo: 'bar'
        };
        const testFunction = function (name) {
            return name.toUpperCase();
        };
        const testNumber = 123;
        const testString = "456";
        const testBooleanFalse = false;
        const testBooleanTrue = true;
        const myMixedCaseString = "My mixed-case string."
        const myMixedCaseStringAsUppercase = "MY MIXED-CASE STRING."

        testRegistry.set('an-object', testObject);
        testRegistry.set('a-function', testFunction);
        testRegistry.set('a-number', testNumber);
        testRegistry.set('a-string', testString);
        testRegistry.set('a-boolean-false', testBooleanFalse);
        testRegistry.set('a-boolean-true', testBooleanTrue);

        // Object
        expect(testRegistry.has('an-object')).to.be.true;
        expect(testRegistry.get('an-object')).to.equal(testObject);

        // Getting something that isn't registered, but with a default this time
        expect(testRegistry.get('not-exists', 'with a default')).to.equal('with a default');
        expect(testRegistry.get('getting.a.nested.object', 'different default')).to.equal('different default');
        
        // Function
        expect(testRegistry.has('a-function')).to.be.true;
        expect(testRegistry.get('a-function')).to.be.an.instanceof(Function);
        const result = testRegistry.get('a-function')(myMixedCaseString);
        expect(result).to.equal(myMixedCaseStringAsUppercase);

        // Number & String
        expect(testRegistry.get('a-number')).to.be.a('number').and.to.equal(testNumber);
        expect(testRegistry.get('a-string')).to.be.a('string').and.to.equal(testString);

        // Boolean - Non-existant
        expect(testRegistry.has('not-exist')).to.be.false; // Does not exist
        // Boolean False
        expect(testRegistry.has('a-boolean-false')).to.be.true; // Boolean exists
        expect(testRegistry.get('a-boolean-false')).to.be.false; // But the boolean value is false.
        // Boolean True
        expect(testRegistry.has('a-boolean-true')).to.be.true; // Boolean exists
        expect(testRegistry.get('a-boolean-true')).to.be.true; // And the boolean value is true.


    });

    it('throws errors on invalid actions', function () {
        testRegistry.set('an-object', {
            foo: 123
        });
        // Re-Setting an already set object
        expect(testRegistry.set.bind(testRegistry, 'an-object', "Boom!")).to.throw(Error);
        // Setting to an undefined object
        expect(testRegistry.set.bind(testRegistry, 'undefined-object', undefined)).to.throw(Error);
        // Getting something that isn't registered
        expect(testRegistry.get.bind(testRegistry, 'non-existant-entry')).to.throw(Error);
    });

    it('can list all item keys in the register', function () {
        const deleteMe = "delete-me";
        testRegistry.set(deleteMe, {
            foo: "I'm gone!"
        });
        const testKeys = [];
        for (let i = 0; i < 10; i++) {
            const key = `object-${i}`;
            testRegistry.set(key, {
                foo: i
            });
            testKeys.push(key);
        }

        // Remove one of the objects and check it.
        testRegistry.remove(deleteMe);
        expect(testRegistry.has(deleteMe)).to.be.false;
        expect(testRegistry.get.bind(testRegistry, deleteMe)).to.throw(Error);

        // Make sure that the keys are as expected
        expect(testRegistry.keys.sort()).to.eql(testKeys);
    });

    it('can have two registries, each with different stuff in it', function () {
        const dogRegistry = new PocketRegistry();
        dogRegistry.set('Lassie', {
            breed: 'collie'
        });
        dogRegistry.set('Snoopy', {
            breed: 'beagle'
        });
        dogRegistry.set('Rocky', {
            breed: 'bulldog'
        });

        const catRegistry = new PocketRegistry();
        catRegistry.set('Morris', {
            breed: 'tabby'
        });
        catRegistry.set('Grumpy Cat', {
            breed: 'calico'
        });
        catRegistry.set('Hobbes', {
            breed: 'tiger'
        });

        // ** Dog registry
        expect(dogRegistry.has('Lassie')).to.be.true;
        expect(dogRegistry.get('Snoopy').breed).to.equal('beagle');
        expect(dogRegistry.has('Rocky')).to.be.true;
        // dogRegistry has no cats
        expect(dogRegistry.has('Morris')).to.be.false;
        expect(dogRegistry.has('Grumpy Cat')).to.be.false;
        expect(dogRegistry.has('Hobbes')).to.be.false;

        // ** Cat registry
        expect(catRegistry.has('Morris')).to.be.true;
        expect(catRegistry.get('Grumpy Cat').breed).to.equal('calico');
        expect(catRegistry.has('Hobbes')).to.be.true;
        // catRegistry has no dogs
        expect(catRegistry.has('Lassie')).to.be.false;
        expect(catRegistry.has('Snoopy')).to.be.false;
        expect(catRegistry.has('Rocky')).to.be.false;
    });

    it('can use paths with nested objects', function () {
        const dogRegistry = new PocketRegistry();
        dogRegistry.set('Lassie', {
            breed: 'collie'
        });
        dogRegistry.set('Snoopy', {
            breed: 'beagle'
        });
        dogRegistry.set('Rocky', {
            breed: 'bulldog'
        });

        // ** Dog registry
        expect(dogRegistry.has('Lassie.breed')).to.be.true;
        expect(dogRegistry.get('Snoopy.breed')).to.equal('beagle');
        // Get nested with a default value
        expect(dogRegistry.get('Snoopy.color', 'unknown')).to.equal('unknown');

        // Remove a non-existant property, shouldn't create the missing child.
        dogRegistry.remove('Snoopy.who.cares');
        expect(dogRegistry.has('Snoopy.who')).to.be.false;
        
        // Setting a nested property, clearing it first.
        dogRegistry.remove('Snoopy.breed');
        expect(dogRegistry.has('Snoopy.breed')).to.be.false;
        expect(dogRegistry.set('Snoopy.breed', 'dinosaur'));
        expect(dogRegistry.get('Snoopy.breed')).to.equal('dinosaur');

        // Setting a previously unset property
        expect(dogRegistry.set('Snoopy.owner', 'Charlie Brown'));
        expect(dogRegistry.get('Snoopy.owner')).to.equal('Charlie Brown');

        // Setting a previously unset nested property
        expect(dogRegistry.set('Fido.breed.species', 'mutt'));
        expect(dogRegistry.get('Fido.breed.species')).to.equal('mutt');
        
    });

});