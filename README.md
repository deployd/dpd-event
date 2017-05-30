## Router Event Resource

A fork to dpd-event-callback to create events that run before target events are run.

It works with a [router middleware](https://github.com/ezra-obiwale/dpd-router-middleware) to ensure this happens.

### Usage

Two methods have been provided to indicate intent:

1. `proceed`: Indicates that the target endpoint event should be run. It takes not parameters.
2. `kill`: Terminates the routing and sends a response. Parameters are error and response.

NOTE: method `setResult` has been removed to mark a major difference between router events and normal events.