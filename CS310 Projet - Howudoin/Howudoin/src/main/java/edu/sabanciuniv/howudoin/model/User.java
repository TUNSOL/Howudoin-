package edu.sabanciuniv.howudoin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Vector;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    // WARNING IF YOU RUN THE CODE PLEASE MAKE THE lastMessageId.txt FILE IN THE SAME DIRECTORY AS THE CODE
    // and just write 0 for the first time.
    // WARNING IF YOU RUN THE CODE PLEASE MAKE THE lastGroupId.txt FILE IN THE SAME DIRECTORY AS THE CODE
    // and just write 1 for the first time.
    // We are using the emails which the users utilized to register themselves, to differentiate them from each other.
    //So in this case the "id" is an email, which is why we store it as a string.
    private String id;
    private String password;
    private String Name;
    private String Lastname;
    private Vector<String> FriendRequestsRecieved;
    private Vector<String> Friends;
    private Vector<String> FriendsRequestsSended;
    private Vector<Message> Messages; //User's own message field saves the messages received or sent by the user. even in the groups, but the recieved messages from the groupes are not stored in there
    private Vector<Integer> Groups;
}
