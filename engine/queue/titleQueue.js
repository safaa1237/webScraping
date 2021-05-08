const amqp = require('amqplib/callback_api');

function sendAsinToQueue(asin) {
  amqp.connect(
    'amqps://qsshxlae:2qF4etyjQ6IYFWWLQ5QoRH_TISf2Wji8@sparrow.rmq.cloudamqp.com/qsshxlae',
    (err, conn) => {
      conn.createChannel((err, ch) => {
        var queue = 'title';

        ch.assertQueue(queue, { durable: false });
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(asin)));
        console.log('Message was sent');
      });
      setTimeout(() => {
        conn.close();
        process.exit(0);
      }, 500);
    },
  );
}

function recieveTitle() {
  amqp.connect(
    'amqps://qsshxlae:2qF4etyjQ6IYFWWLQ5QoRH_TISf2Wji8@sparrow.rmq.cloudamqp.com/qsshxlae',
    (err, conn) => {
      conn.createChannel((err, ch) => {
        var queue = 'title';

        ch.assertQueue(queue, { durable: false });
        console.log('waiting for title');
        ch.consume(
          queue,
          (title) => {
            console.log(title);
            return title;
          },
          { noAck: true },
        );
      });
    },
  );
}

module.exports = recieveTitle();
module.exports = sendAsinToQueue();
