import socket
import csv
import numpy as np
import pandas as pd
import time


server_address = ('0.0.0.0', 4444) 


# Create a socket to listen for connections
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(server_address)
server_socket.listen(1)

print("Waiting for a connection...")

# Accept the connection
client_socket, client_address = server_socket.accept()
print(f"Connection from {client_address}")

# Create a CSV file for writing data
csv_filename = 'data.csv'
csv_file = open(csv_filename, 'w', newline='')
csv_writer = csv.writer(csv_file)

# Write header to the CSV file
csv_writer.writerow(['Time', 'AnalogData', 'DigitalData'])

# Set the duration for data collection (300 seconds)
collection_duration = 300
end_time = time.time() + collection_duration

# Set the sampling rate (256 Hz)
sampling_rate = 256
sampling_interval = 1 / sampling_rate

try:
    while time.time() < end_time:
        # Receive data from NodeMCU
        data = client_socket.recv(1024).decode('utf-8').strip()

        # Check if the data is not empty and is numeric
        if data and data.replace('.', '', 1).isdigit():
            # Parse and process the analog data (replace this with your actual processing)
            analog_data = float(data)
            digital_data = int(analog_data * 1023)  # Translate analog to digital

            # Get the current timestamp
            timestamp = time.time()

            # Write data to the CSV file
            csv_writer.writerow([timestamp, analog_data, digital_data])

            # Wait for the next sampling interval
            time.sleep(sampling_interval)

finally:
    # Close the socket and CSV file
    client_socket.close()
    server_socket.close()
    csv_file.close()

# Load the data into a Pandas DataFrame for further analysis if needed
df = pd.read_csv(csv_filename)
print(df.head())