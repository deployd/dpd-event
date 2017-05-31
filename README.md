## Router Event Resource

A fork to dpd-event-callback to create events that run before target events are run.

It works with a [router middleware](https://github.com/ezra-obiwale/dpd-router-middleware) to ensure this happens.

### Installation

`npm install dpd-router-event dpd-router-middleware --save`

### Usage

The following methods have been provided to indicate intent:

1. `skip`: Only available the `ON BEFOREREQUEST` event and indicates that the method event should be skipped and the actual resource request event should be executed.
2. `proceed`: Available on all events except the `ON BEFOREREQUEST` and indicates that the actuall resource request event should be run. It takes not parameters.
3. `kill`: Terminates the routing and sends a response. Parameters are error and response.
4. `killIf`: Calls the kill method if the logic is true. Parameters are logic, error and response.

NOTE: method `setResult` has been removed to mark a major difference between router events and normal events.