angular.module('eGarageApp')

/**
 * A fake service designed to simulate an asynchronous call to a server for data.
 */
.service('userService', function($q, $timeout) {
  
  this.getUserName = function(id) {
    var deferred = $q.defer();
    var userId = parseInt(id, 10);
    
    $timeout(function() {
      if (userId === 1) {
        deferred.resolve('Alan Partridge');
      } else if (userId === 2) { 
        deferred.resolve('Peter O\'Hanraha-hanrahan');
      } else {
        deferred.resolve('User Not Found!');
      }
    }, 10);
    
    return deferred.promise;
  } 
  
  this.getUserImage = function(id) {
    var deferred = $q.defer();
    var userId = parseInt(id, 10);
    
    $timeout(function() {
      if (userId === 1) {
        deferred.resolve('http://upload.wikimedia.org/wikipedia/commons/2/2f/Alan_partridge2.jpg');
      } else if (userId === 2) { 
        deferred.resolve('http://i1.ytimg.com/vi/Rv85s_v3LKo/hqdefault.jpg');
      } else {
        deferred.resolve('http://upload.wikimedia.org/wikipedia/commons/9/9e/Bill_Hicks_at_the_Laff_Stop_in_Austin%2C_Texas%2C_1991_%282%29_cropped.jpg');
      }
    }, 10);
    
    return deferred.promise;
  } 
  
}) 
;