var cassandra = require('cassandra-driver');
const uuidv4 = require('uuid/v4');
var client = null;

const query_create_table_users = 'CREATE TABLE IF NOT EXISTS user(user_id text PRIMARY KEY,user_name text)';
const query_create_table_posts = 'CREATE TABLE IF NOT EXISTS post(post_id uuid PRIMARY KEY,user_id text,post_content text)';
const query_delete_table_user = "DROP TABLE IF EXISTS dev.user;";
const query_delete_table_post = "DROP TABLE IF EXISTS dev.post;";

//method to initialize connection to database
exports.connect = function(){
  client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'dev'});
    client.execute(query_create_table_users,function(err) {
      if(!err)
        console.log('users table created successfully');
        else {
            console.log(err);
          }
        });

    client.execute(query_create_table_posts,function(err) {
      var create_index ='CREATE INDEX ON post(user_id);';
      client.execute(create_index);
      if(!err)
        console.log('posts table created successfully');
        else {
            console.log(err);
          }
        });
}

//returns current db instance
exports.Client = function(){
  if (client === null) throw Error('DB Object has not yet been initialized');
    return client;
}

//finds used given fb id
exports.findUser=function(id,cb){
  var query = "SELECT * FROM user WHERE user_id=?";
  client.execute(query, [id], function(err, result) {
  cb(err,result.rows[0]);
});
}

//returns all posts associated with the current user
exports.getPosts = function(id,cb){
  var query = "SELECT * FROM post WHERE user_id=?;";
  client.execute(query, [id], function(err, result) {
  cb(err,result.rows);
});
}

//adds a user to the database
var insert = "INSERT INTO user (user_id, user_name) VALUES (?, ?)";
exports.dbInsert = function(profile) {
    client.execute(insert, [profile.id, profile.displayName], function (err, result) {
	console.log(err);
	console.log('login successfully: ' + profile.displayName+' '+profile.id);
    });
};

//adds a post to the database
var insert_post = "INSERT INTO post (post_id,user_id, post_content) VALUES (?, ?, ?)";
exports.dbInsertPost = function(post,cb){
  client.execute(insert_post, [uuidv4(), post.user_id ,post.post_content], function (err, result) {
console.log(err);
console.log(result);
console.log('post successfully added: ' + result.post_content);
  });
  cb();
}

//deletes the post from the database
var delete_post = "DELETE FROM post WHERE post_id= ?";
exports.deletePost = function(postID,cb){
  client.execute(delete_post, [postID], function (err, result) {
console.log(err);
console.log(result);
console.log('post successfully deleted');
  });
  cb();
}
