import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

export async function rabbitConn() {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
}

export async function subscribeToQueue(queueName, callback) {
    if (!channel) await rabbitConn();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

export async function publishToQueue(queueName, data) {
    if (!channel) await rabbitConn();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}
