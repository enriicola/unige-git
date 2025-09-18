// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract WishOfTheDay {
   // state variables
   struct Wish {
      uint256 date;
      string message;
      string author;
   }
   mapping(address => Wish) public wish_feed;
   address owner;
   address last;
   address[] writers;

   constructor() {
      wish_feed[msg.sender] = Wish(block.timestamp, "si sta come i gatti, nelle scatole, a casa di shrodinger!", "Enrico");
      last = owner = msg.sender;
      writers.push(msg.sender);
   }

   function getOneWish(address _from) public view returns (Wish memory) {
      require(wish_feed[_from].date != 0, "Wish not found");
      return wish_feed[_from];
   }

   function getLastWish() public view returns (Wish memory) {
      return wish_feed[last];
   }

   function getAllWishes() public view returns (Wish[] memory) {
      require(msg.sender == owner, "Only owner can access this function");

      Wish[] memory messages = new Wish[](writers.length);
      for (uint256 i = 0; i < writers.length; i++) {
         messages[i] = wish_feed[writers[i]];
      }
      return messages;
   }

   function setOneWish(string memory _message, string memory _author) public {
      require(bytes(_message).length > 0 && bytes(_message).length <= 256, "Message must be between 1 and 256 characters");
      require(bytes(_author).length > 0 && bytes(_author).length <= 100, "Author must be between 1 and 100 characters");

      if (wish_feed[msg.sender].date == 0) {
         writers.push(msg.sender);
      }
      wish_feed[msg.sender] = Wish(block.timestamp, _message, _author);
      last = msg.sender;
   }

   
}