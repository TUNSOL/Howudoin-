package edu.sabanciuniv.howudoin.repository;

import edu.sabanciuniv.howudoin.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<Message, Integer> {
}

