package client;

import java.io.*;
import java.net.*;

public class Client {
	public static void main(String[] args)
	{
		// establish a connection by providing host and port number
		try (Socket socket = new Socket("127.0.0.1", 1234)) {
         new GUI(socket);
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
}