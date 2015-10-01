/**
 *  Tests the GeolocationService
 */
describe('Tests the geolocation service', function() {
    'use strict';

    /**
     * The GeolocationService to test
     */
    var GeolocationService;
    /**
     * rootScope to use in testing
     */
    var $rootScope;

    /**
     * Sets up the module to use in testing
     */
    beforeEach(module('geolocation'));

    /**
     * Injects everything needed during testing.
     */
    beforeEach(inject(function(_GeolocationService_, _$rootScope_){
            GeolocationService = _GeolocationService_;
            $rootScope = _$rootScope_;
        }));

    /**
     * Test the geolocation getPosition() method when there is not position
     * stored initially. Verifies the expected return position is called and
     * no errors are returned.
     */
    it('Test geolocation getPosition, no initial position', function () {
        var returnedPosition;
        var returnedError;
        var originalNav;
        var geolocationSpy;

        /** Setup Test */
        geolocationSpy = jasmine.createSpyObj('geolocationSpy',[
            'getCurrentPosition'
            ])

        geolocationSpy.getCurrentPosition.and.callFake(function (callback) {
            callback('abc');
        })

        originalNav = navigator;
        navigator = {
            geolocation: geolocationSpy
        }

        /** Run Test */
        GeolocationService.getPosition()
            .then(function (position) {
                returnedPosition = position;
            },
            function (error) {
                returnedError = error;
            });

        $rootScope.$apply();

        /** Verify Test */
        expect(returnedPosition).toEqual('abc');
        expect(returnedError).toBeUndefined();

        navigator = originalNav;
    });

    /**
     * Test the geolocation getPosition() method when there is a position
     * stored. Verifies the correct positions are returned and there
     * are no errors.
     */
    it('Test geolocation getPosition, with position', function () {
        var returnedPosition1;
        var returnedPosition2;
        var returnedError1;
        var returnedError2;
        var geolocationSpy;

        /** Setup Test */
        geolocationSpy = jasmine.createSpyObj('geolocationSpy',[
            'getCurrentPosition'
            ])

        geolocationSpy.getCurrentPosition.and.callFake(function (callback) {
            callback('fake location');
        })

        var originalNav = navigator;
        navigator = {
            geolocation: geolocationSpy
        }

        GeolocationService.getPosition()
            .then(function (position) {
                returnedPosition1 = position;
            },
            function (error) {
                returnedError1 = error;
            });

        $rootScope.$apply();

        /** Verify Setup */
        expect(returnedPosition1).toEqual('fake location');
        expect(returnedError1).toBeUndefined();

        /** Run Test */
        GeolocationService.getPosition()
            .then(function (position) {
                returnedPosition2 = position;
            },
            function (error) {
                returnedError2 = error;
            });
        $rootScope.$apply();

        /** Verify Test */
        expect(returnedPosition2).toEqual('fake location');
        expect(returnedPosition1).toEqual(returnedPosition2);
        expect(returnedError2).toBeUndefined();

        navigator = originalNav;
    });

    /**
     * Test the geolocation getPosition() method when there is an error
     * retrieving the position from the navigator. Verifies no location
     * is returned and instead an error is returned.
     */
    it('Test geolocation getPosition, error', function () {
        var returnedPosition;
        var returnedError;
        var originalNav;
        var geolocationSpy;

        /** Setup Test */
        geolocationSpy = jasmine.createSpyObj('geolocationSpy', [
            'getCurrentPosition'
        ]);

        geolocationSpy.getCurrentPosition.and.callFake(
            function (callback, errorCallback) {
                errorCallback('Error occured!');
            });

        originalNav = navigator;
        navigator = {
            geolocation: geolocationSpy
        };

        /** Run Test */
        GeolocationService.getPosition()
            .then(function (position) {
                returnedPosition = position;
            },
            function (error) {
                returnedError = error;
            });

        $rootScope.$apply();

        /** Verify Test */
        expect(returnedPosition).toBeUndefined();
        expect(returnedError).toEqual('Error occured!');

        navigator = originalNav;
    });

    /**
     * Test the geolocation getPosition() method when there is no
     * geolocation in the navigator. Verifies an error is returned
     * stating there is a geolocation error.
     */
    it('Test geolocation getPosition, error', function () {
        var returnedPosition;
        var returnedError;
        var originalNav;

        /** Run Test */
        GeolocationService.getPosition()
            .then(function (position) {
                returnedPosition = position;
            },
            function (error) {
                returnedError = error;
            });

        $rootScope.$apply();

        /** Verify Test */
        expect(returnedPosition).toBeUndefined();
        expect(returnedError).toEqual('Geolocation error.');
    });

});