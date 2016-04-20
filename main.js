var _ = require('lodash');

module.exports = (function(grunt) {   // require('grunt-config-config')

  // Factory method that creates a new path-type function. Each one has a
  // `sub` method, which recursively creates another path-type function for
  // a subdirectory.
  var _newPath = function(f) {
    return _.assign(f, {
      sub: function(kid) {
        // The subdir function is the result of partially applying this 
        // subdirectory (kid) to the parent function
        return _newPath(_.partial(this, kid));
      },
    });
  };

  // Create a clone of path.join (so we're not changing the system version) 
  // and then add the `sub` method.
  var _base = _.bind(require('path').join);

  var cc = {

    extend: obj => _.assign(cc, obj),

    base: _newPath(_base, null),

    // Read config overrides from a node.js module. By default, this is only
    // used by the user config, but it could be used for others as well.
    readConfigJs: function(path) {
      var c = null;
      try {
        c = require(path)(grunt, cc);
      }
      catch(err) {}
      return c;
    },

    //-----------------------------------------------------------------
    // Profiles

    profilesEnabled: true,

    // `dev` is the default profile. The application should not
    // require any customization or command-line switches to be able to bring
    // it up by a developer. Because that's default, it should not have any 
    // config overrides.
    defaultProfile: 'dev',

    // By default there are no overrides (of course).
    profileConfigs: {},

    // Get the name of the profile. By default, this is from the command line
    // argument `--profile=<profile>`
    getProfile: function() {
      return grunt.option('profile') || cc.defaultProfile;
    },

    // Get the configuration overrides for this profile
    getProfileConfig: function() {
      var pc = null;
      if (cc.profilesEnabled) {
        var p = cc.getProfile();
        pc = cc.profileConfigs[cc.defaultProfile] || null;
      }
      return pc;          
    },

    //-----------------------------------------------------------------
    // User override

    // Users can override configuration by creating a file named (by default)
    // grunt.<username>.js in the project root directory.
    userConfigsEnabled: true,

    // Get the path of the user config file. This returns a string that gives
    // either the absolute path, or relative to the project base.
    getUserConfigPath: function() {
      var user = process.env.USER;
      return user ? path.join('.', `grunt.${user}.js` : null;
    },

    // Get the actual config file, if it exists
    getUserConfig: function() {
      var path = cc.getUserConfigPath();
      return path ? cc.readConfigJs(path) : null;
    },

    //-----------------------------------------------------------------
    // Merged config

    // Function that does the merging (the "customizer" described here:
    // https://lodash.com/docs#mergeWith). By default, this causes arrays
    // to be concatenated, unlike Grunt's merge, that causes array values
    // to be overwritten.
    mergeFunction: function(objValue, srcValue) {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    },

    getConfig: function(defaultConfig, opts) {
      var c = _.merge({}, cc, opts);
      return _.mergeWith(defaultConfig, 
        cc.getProfileConfig(), cc.getUserConfig(), cc.mergeFunction);
    },
  };
    
  return cc;
});
