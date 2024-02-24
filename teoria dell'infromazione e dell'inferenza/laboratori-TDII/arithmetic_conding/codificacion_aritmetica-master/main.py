import codigo_aritmetico


frequency_table = {"a": 0.25,
                   "b": 0.15,
                   "c": 0.3,
                   "d": 0.3}

AE = codigo_aritmetico.ArithmeticEncoding(frequency_table=frequency_table,
                                          save_stages=True)

original_msg = "dcabc"
print("Original Message: {msg}".format(msg=original_msg))

encoded_msg, encoder, interval_min_value, interval_max_value = AE.encode(msg=original_msg,
                                                                         probability_table=AE.probability_table)
print("Encoded Message: {msg}".format(msg=encoded_msg))

decoded_msg, decoder = AE.decode(encoded_msg=encoded_msg,
                                 msg_length=len(original_msg),
                                 probability_table=AE.probability_table)
print("Decoded Message: {msg}".format(msg=decoded_msg))

decoded_msg = "".join(decoded_msg)
print("Message Decoded Successfully? {result}".format(
    result=original_msg == decoded_msg))
