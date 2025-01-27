package edu.sabanciuniv.howudoin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private int id;
    private String message;
    private String senderUserName;
    private String receiverUserName;
    private int GroupId;
    private static int CounterID;

    static {
        try (BufferedReader reader = new BufferedReader(new FileReader("lastMessageId.txt"))) {
            CounterID = Integer.parseInt(reader.readLine());
        } catch (IOException e) {
            CounterID = 1; // Default to 1 if the file doesn't exist or an error occurs
        }
    }


    //Below function is used when a user sends a message to another individual user.
    //The GroupId is set to 0 to indicate that this message isn't targeted to a group.
    public Message(String message, String senderUserName, String receiverUserName) {
        this.id = CounterID;
        CounterID++;
        updateLastMessageId();
        this.message = message;
        this.senderUserName = senderUserName;
        this.receiverUserName = receiverUserName;
        this.GroupId = 0;
    }

    //This function has the same functionality but the only difference is that it sends a message to a group.
    //The GroupId is the field that will show the targeted group.
    //We used no receiverName since it isn't specified to who the message will be sent to(Everyone in the group will receive it).
    public Message(String message, String senderUserName, int GroupId) {
        this.id = CounterID;
        CounterID++;
        updateLastMessageId();
        this.message = message;
        this.senderUserName = senderUserName;
        this.GroupId = GroupId;
        this.receiverUserName = String.valueOf(GroupId);
    }


    //We created this function to ensure that the CounterID of a message protects it's value when the application starts again.
    //Basically, if the last messages ID was 100 and the appliccation stopped, by the time it restarts and another message is sent,
    //The new message will have the CounterID 101. So it ensures that there are no duplicate ID's for any message.
    private void updateLastMessageId() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("lastMessageId.txt"))) {
            writer.write(String.valueOf(CounterID));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}