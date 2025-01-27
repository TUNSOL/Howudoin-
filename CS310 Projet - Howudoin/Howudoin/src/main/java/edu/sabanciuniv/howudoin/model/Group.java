package edu.sabanciuniv.howudoin.model;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Vector;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    private int id;
    private String GroupName;
    private String GroupAdmin;
    private Vector<String> GroupMembers;
    private Vector<Message> messages; //Another message field which stores the messages sent within the group.
    private static int CounterID;
    private String time;


    // WARNING IF YOU RUN THE CODE PLEASE MAKE THE lastMessageId.txt FILE IN THE SAME DIRECTORY AS THE CODE
    // and just write 0 for the first time.
    // WARNING IF YOU RUN THE CODE PLEASE MAKE THE lastGroupId.txt FILE IN THE SAME DIRECTORY AS THE CODE
    // and just write 1 for the first time.
    static {
        try (BufferedReader reader = new BufferedReader(new FileReader("lastGroupId.txt"))) {
            CounterID = Integer.parseInt(reader.readLine());
        } catch (IOException e) {
            CounterID = 1; // Default to 1 if the file doesn't exist or an error occurs
        }
    }

    public Group(String GroupName, String groupAdmin, Vector<String> GroupMembers, Vector<Message> messages) {
        // A little update for the constructor will be done in Phase 2 for this.
        this.id = CounterID;
        CounterID++;
        updateLastGroupId();
        this.GroupName = GroupName;
        this.GroupMembers = GroupMembers;
        this.messages = messages;
        this.GroupAdmin = groupAdmin;
        this.time = LocalDateTime.now().toString();
    }

    private void updateLastGroupId() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("lastGroupId.txt"))) {
            writer.write(String.valueOf(CounterID));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}