var Resource = require('deployd/lib/resource')
  , Script = require('deployd/lib/script')
  , util = require('util');

function EventResource() {
  Resource.apply(this, arguments);
}
util.inherits(EventResource, Resource);

EventResource.label = "Event";
EventResource.events = ["get", "post", "put", "delete"];

module.exports = EventResource;

EventResource.prototype.clientGeneration = true;

EventResource.prototype.handle = function (ctx, next) {
  var parts = ctx.url.split('/').filter(function(p) { return p; });

  var result = {};
  
  var errors = {};
  var hasErrors = false;

  var domain = {
      url: ctx.url
    , parts: parts
    , query: ctx.query
    , body: ctx.body
    , 'this': result
    , getHeader: function (name) {
        if (ctx.req.headers) {
            return ctx.req.headers[name];
        }
      }
    , setHeader: function (name, value) {
        if (ctx.res.setHeader) {
            ctx.res.setHeader(name, value);
        }
      }
    , setResult: function(val) {
      result = val;
    }
    , error: function(key, val) {
      errors[key] = val || true;
      hasErrors = true;
    }
    , errorIf: function(condition, key, value) {
      if (condition) {
        domain.error(key, value);
      }
    }
    , errorUnless: function(condition, key, value) {
      domain.errorIf(!condition, key, value);
    }
    , hasErrors: function() {
      return hasErrors;
    }
    , require: function(module) { // expose require function
      return require(module);
    }
  };

  if (ctx.method === "POST" && this.events.post) {
    this.events.post.run(ctx, domain, function(err) {
      if(err || domain.hasErrors()) return ctx.done(err || errors);
      Promise.resolve(result).then(function(r) { ctx.done(null, r)});
    });
  } else if (ctx.method === "GET" && this.events.get) {
    this.events.get.run(ctx, domain, function(err) {
      if(err || domain.hasErrors()) return ctx.done(err || errors);
      Promise.resolve(result).then(function(r) { ctx.done(null, r)});
    });
  } else if (ctx.method === "DELETE" && this.events.delete) {
    this.events.delete.run(ctx, domain, function(err) {
      if(err || domain.hasErrors()) return ctx.done(err || errors);
      Promise.resolve(result).then(function(r) { ctx.done(null, r)});
    });
  } else if (ctx.method === "PUT" && this.events.put) {
    this.events.put.run(ctx, domain, function(err) {
      if(err || domain.hasErrors()) return ctx.done(err || errors);
      Promise.resolve(result).then(function(r) { ctx.done(null, r)});
    });
  } else {
    next();
  }

  
};
