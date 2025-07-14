import pandas as pd

def main():
    # 1) Load
    df = pd.read_csv('archive/Pokemon.csv')
    
    # 2) Peek at the next row's evolution number
    #    (shift(-1) moves everything up by one, so df['next_evo'] at index i 
    #     holds the Evolution Number from row i+1)
    df['next_evo'] = df['Evolution Number'].shift(-1)
    
    # 3) Mark final form where that next_evo == 1
    df['final form'] = df['next_evo'] == 1
    
    # 4) (optional) drop the helper column
    df.drop(columns=['next_evo'], inplace=True)
    
    # 5) Write back (overwrites your original file)
    df.to_csv('archive/Pokemon.csv', index=False)
    print("✅ Pokemon.csv updated with new column 'final form'.")

if __name__ == '__main__':
    main()
