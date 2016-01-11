var Botkit = require('botkit')
  , controller
  , storageType = (process.env.STORAGE || 'redis').toLowerCase()
  , slackbotConfig = {debug: false};

if (storageType === 'redis') {
  slackbotConfig.storage = require('botkit-storage-redis')({
    url: process.env.REDIS_URL
  });
} else if (storageType === 'firebase') {
  slackbotConfig.storage = require('botkit-storage-firebase')({
    firebase_uri: process.env.FIREBASE_URI
  });
} else if (storageType === 'mongo') {
  slackbotConfig.storage = require('botkit-storage-mongo')({
    mongoUri: process.env.MONGO_URL
  });
}

controller = Botkit.slackbot(slackbotConfig);

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_API_TOKEN
}).startRTM();

[
  'teams',
  'channels',
  'users'
].forEach(function(zone) {
  controller.hears(zone + '\.all', 'direct_mention', function(bot, message) {
    controller.storage[zone].all(function(err, res) {
      if (err) {
        bot.reply(message, 'Couldn\'t get all data: ' + err.message);
      }

      bot.reply(message, JSON.stringify(res, null, 2));
    });
  });

  controller.hears(zone + '\.get (.*)', 'direct_mention', function(bot, message) {
    var id = message.match[1];
    controller.storage[zone].get(id, function(err, res) {
      if (err) {
        return bot.reply(message, 'Couldn\'t get data: ' + err.message);
      }

      var reply = 'No data';
      if (res) {
        reply = res.data;
      }
      bot.reply(message, reply);
    });
  });

  controller.hears(zone + '\.save (.*) (.*)', 'direct_mention', function(bot, message) {
    var data = {id: message.match[1], data: message.match[2]};

    controller.storage[zone].save(data, function(err) {
      if (err) {
        return bot.reply(message, 'Couldn\'t save data: ' + err.message);
      }
      bot.reply(message, 'data saved');
    });
  });
});

controller.hears('help', 'direct_mention', function(bot, message) {
  var botname = '@' + bot.identity.name
    , reply = '' +
    '`' + botname + ' teams.all`: Prints all data stored in teams.\n' +
    '`' + botname + ' teams.get <id>`: Prints the value stored for <id> in teams.\n' +
    '`' + botname + ' teams.save <id> <string>`: Saves a string with the given ID in teams.\n\n' +
    '`' + botname + ' channels.all`:  Prints all data stored in channels.\n' +
    '`' + botname + ' channels.get <id>`: Prints the value stored for <id> in channels.\n' +
    '`' + botname + ' channels.save <id> <string>`: Saves a string with the given ID in channels.\n\n' +
    '`' + botname + ' users.all`:  Prints all data stored in users.\n' +
    '`' + botname + ' users.get <id>`: Prints the value stored for <id> in users.\n' +
    '`' + botname + ' users.save <id> <string>`: Saves a string with the given ID in users.\n' +
    '';

  bot.reply(message, reply);
});
