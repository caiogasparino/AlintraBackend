# docker exec -it kafka /opt/bitnami/kafka/bin/kafka-console-consumer.sh \
#   --bootstrap-server localhost:9092 \
#   --from-beginning \
#   --topic test-topic \
#   --max-messages 10 \
#   --property print.key=true \
#   --property print.value=true \
#   --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer \
#   --property value.deserializer=org.apache.kafka.common.serialization.StringDeserializer

docker exec -it kafka /opt/bitnami/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic test-topic \
  --max-messages 10 \
  --from-beginning
