import csv

def add_column_to_csv(input_file, output_file, new_column_name, new_value):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        rows = []

        # Use original fieldnames and add the new column
        fieldnames = reader.fieldnames
        if not fieldnames:
            raise ValueError("Input CSV does not contain headers.")

        updated_fieldnames = fieldnames + [new_column_name]

        for row in reader:
            # Skip completely empty rows
            if not any(row.values()):
                continue

            # Clean the row to only include known fields
            clean_row = {key: row[key] for key in fieldnames}
            clean_row[new_column_name] = new_value
            rows.append(clean_row)

    with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=updated_fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def print_legendaries(input_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        legendaries = []

        for row in reader:
            if row.get('Legendary') == 'True':
                legendaries.append(row['Name'])

        if legendaries:
            print("Legendary Pokemons:")
            for pokemon in legendaries:
                print(pokemon)
        else:
            print("No legendary pokemons found.")


# set legendary to false if present in the not-legendary.txt file
def set_not_legendary(input_file, not_legendary_file):
    with open(not_legendary_file, 'r') as f:
        not_legendary = set(line.strip() for line in f)

    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        rows = []

        for row in reader:
            if row['Name'] in not_legendary:
                row['Legendary'] = 'False'
            rows.append(row)

    with open(input_file, mode='w', newline='', encoding='utf-8') as outfile:
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)



# add_column_to_csv(
#     input_file='nuovo/Pokemon.csv',
#     output_file='output.csv',
#     new_column_name='Evolution Number',
#     new_value='1'
# )


            
print_legendaries('archive/Pokemon.csv')



        
# set_not_legendary('archive/Pokemon.csv', 'not-legendary.txt')