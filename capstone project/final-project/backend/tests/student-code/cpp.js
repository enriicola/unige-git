// Snippet of C++ code used in test files

export const cppCorrectTwoSum = `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <cctype>
#include <sstream>

using namespace std;

vector<long long> parseNumbers(const string &s) {
    vector<long long> vals;
    long long cur = 0;
    bool inNum = false;
    bool neg = false;
    for (char c : s) {
        if (c == '-' && !inNum) { neg = true; continue; }
        if (isdigit(static_cast<unsigned char>(c))) {
            if (!inNum) { inNum = true; cur = 0; }
            cur = cur * 10 + (c - '0');
        } else if (inNum) {
            vals.push_back(neg ? -cur : cur);
            cur = 0; inNum = false; neg = false;
        } else { neg = false; }
    }
    if (inNum) {
        vals.push_back(neg ? -cur : cur);
    }
    return vals;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string input;
    {
        ostringstream oss;
        oss << cin.rdbuf();
        input = oss.str();
    }

    vector<long long> numbers = parseNumbers(input);
    if (numbers.size() < 2) {
        cout << "[]";
        return 0;
    }
    long long target = numbers.back();
    vector<long long> nums(numbers.begin(), numbers.end() - 1);

    unordered_map<long long, int> seen;
    int i = -1, j = -1;
    for (int idx = 0; idx < static_cast<int>(nums.size()); ++idx) {
        long long need = target - nums[idx];
        auto it = seen.find(need);
        if (it != seen.end()) { i = it->second; j = idx; break; }
        seen[nums[idx]] = idx;
    }

    cout << "[" << (i < 0 ? -1 : i) << "," << (j < 0 ? -1 : j) << "]";
    return 0;
}`;

export const cppInvalid = `int main(){ std::cout << "Broken" return 0; }`;
