var Resource = require('deployd/lib/resource')
  , Script = require('deployd/lib/script')
  , util = require('util');

function EventResource() {
  Resource.apply(this, arguments);
}
util.inherits(EventResource, Resource);

EventResource.label = "Event";
EventResource.events = ["Get", "Post", "Put", "Delete", "Head", "BeforeRequest"];

module.exports = EventResource;

EventResource.prototype.clientGeneration = true;

EventResource.prototype.doBeforeRequestEvent = function (ctx, domain, fn) {
  var collection = this;
  if (collection.events.BeforeRequest) {
    collection.events.BeforeRequest.run(ctx, domain, fn);
  } else {
    fn();
  }
};

EventResource.prototype.handle = function (ctx, next) {
  var collection = this;

  var parts = ctx.url.split('/').filter(function (p) { return p; });

  var result = {};

  var domain = {
    url: ctx.url
    , parts: parts
    , query: ctx.query
    , body: ctx.body
    , 'this': result
    , getHeader: function (name) {
      if (ctx.req.headers && typeof name == 'string' && name) {
        return ctx.req.headers[name.toLowerCase()];
      }
    }
    , setHeader: function (name, value) {
      if (ctx.res.setHeader) {
        ctx.res.setHeader(name, value);
      }
    }
    , setStatusCode: function (statusCode) {
      if (typeof statusCode !== "number") throw new TypeError("Status code must be a number")
      ctx.res.statusCode = statusCode;
    }
    , setResult: function (val) {
      if (typeof val === 'string' || typeof val === 'object') {
        result = val;
      } else {
        result = '' + val;
      }
    }
  };

  collection.doBeforeRequestEvent(ctx, domain, function (err) {
    if (err) return ctx.done(err, {});
    if (ctx.method === "POST" && collection.events.Post) {
      collection.events.Post.run(ctx, domain, function (err) {
        ctx.done(err, result);
      });
    } else if (ctx.method === "GET" && collection.events.Get) {
      collection.events.Get.run(ctx, domain, function (err) {
        ctx.done(err, result);
      });
    } else if (ctx.method === "DELETE" && collection.events.Delete) {
      collection.events.Delete.run(ctx, domain, function (err) {
        ctx.done(err, result);
      });
    } else if (ctx.method === "PUT" && collection.events.Put) {
      collection.events.Put.run(ctx, domain, function (err) {
        ctx.done(err, result);
      });
    } else if (ctx.method === "HEAD" && collection.events.Head) {
      collection.events.Head.run(ctx, domain, function (err) {
        ctx.done();
      });
    } else {
      next();
    }
  });
};
