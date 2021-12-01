import { Kafka, Producer as KafkaProducer, Message } from 'kafkajs'

interface InProduceProps {
  topic: string
  messages: Message[]
}

export default class Producer {
  private producer: KafkaProducer

  constructor() {
    const kafka = new Kafka({
      clientId: 'example-producer',
      brokers: ['kafka:29092'],
    })

    this.producer = kafka.producer()
  }

  public async produce({ topic, messages }: InProduceProps) {
    await this.producer.connect()
    await this.producer.send({
      topic,
      messages,
    })
    await this.producer.disconnect()
  }
}
