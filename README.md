

# Instructions

## Context

We have a single train station that can have an arbitrary number of different train
lines running through it. (e.g. the Fulton Street stop of the NYC MTA, which hosts the
2, 3, 4, 5, A, C, J, and Z lines).

We would like a service to manage the schedules of the different trains that runthrough this specific station.

## Objective & Requirements

Write a small web service (with API) that provides endpoints that track and manage the train schedules for this specific station.

### Service Capability

This web service should have the following capability
* A means for clients to post a schedule for a new train line that runs through this station. This post should accept the following information:
    * The name of the train line (a string that contains up to four alphanumeric characters, e.g. `‘EWR0’`, `‘ALP5’`, `‘TOMO’`, etc)
    * The list of times when this particular train arrives at this station. These are specific to the minute the train arrives (i.e. `‘9:53 PM’`)
*  A means for clients to get the next time multiple trains are going to be arriving at this station in the same minute. This request should accept a time value as an argument, and return a timestamp that reflects the next time two or more trains will arrive at this station simultaneously after the submitted time value.

    Some other behavior assumptions:
    *  You can assume that all trains have the same schedule each day (i.e. no special schedules for weekends and holidays).
    * If there are no remaining times after the passed-in time value when multiple trains will be in the station simultaneously, the service should return the first time of the day when multiple trains arrive at the station simultaneously (since that’s when it’ll first happen tomorrow).
    * If there are no instances when multiple trains are in the station at the same time, this method should return no time.

You may define the API contract for this service however you wish, including the format used for accepting and returning time arguments. The endpoint should return a 200 response for valid requests, and a 4xx request for invalid requests (with actual HTTP code at your discretion).

### Service State

This web service has a key-value store for keeping state, with the following calls and characteristics:

* You can call the `db.set(key, value)` method (with syntax adapted to the language of your choosing) to set the value associated with a key. 

  This method can accept any object type as `‘value’`, and does not return a value (unless the language you’re using mandates a return type, in which case use your discretion and state your assumption).

* You can call the `db.fetch(key)` method (with syntax adapted to the language of your choosing) to retrieve the object set at a key. 

   This method returns the object set at that key if the key is defined, `undefined` if not.

* You can call the `db.keys()` method (with syntax adapted to the language of your choosing) to return the list of all defined keys in the database. This function returns an empty list if none have been defined.

* This key-value store is thread-safe.

The service needs to use this hypothetical key-value store (with only these three
methods available).

## Expectations and Assumptions

* You can use whatever language, framework, and tools you feel most comfortable with.
* You can use whatever schema and data types for the service endpoints that you feel makes the most sense.
* You can use whatever dependencies are useful to solve the problem.
* You do not need to worry about user authentication or accreditation as part of the prompt. All endpoints can be public to anonymous users.
* You may mock out the implementation of the key-value store endpoints however makes sense to test/validate/compile your implementation. (Or not at all. It’s acceptable if the service does not run for lack of an implementation for
the DB interface methods).
* It’s OK to make additional assumptions that aren’t encoded in this prompt – just be sure to document them.
* You may ask any questions you need to pursue this prompt, including questions to clarify assumptions around performance requirements, scale, etc.