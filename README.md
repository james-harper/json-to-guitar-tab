# JSON to Guitar Tab
This is a tool to generate guitar tablature using JSON notation.

## Usage
```json
[
    {
        "chords": ["D major"],
        "pattern": "x---"
    },
    {
        "chords": ["-57775", "577655"],
        "pattern": "x--x-x-"
    }
]
```

This tool expects an array representing each bar of the resulting tab.

Each bar should contain an array of `chords` and a string representing a `pattern`

### Chords
There are 2 ways that chords can be written.

- Chords can be written in English (eg `A minor`) and if it is recognised a shape will be randomly selected.
The available extensions are `major`, `minor`, `5`, `7`, `maj7`, and `min7`. Any note in the chromatic scale can be used as a root. Flats and sharps should be converted appropriately.
- Chords can also be written as a 6 character string (`EADGBe`), where each character represents a string on the guitar.
For example, an `E major` chord could be written as `022100`. Fret numbers are hexadecimal, so frets from 0-15 can be expressed using this notation. A dash `-` should be used to denote strings that are not played as part of a chord and an `x` should be used to denote a muted string.
- This app was intended to represent chord progressions, rather than being a comprehensive tabbing tool. But single notes can be added by using dashes for the 5 other strings. Eg `-4----`.

### Pattern

The pattern string allows different rhythms to represented. Currently `4/4` is the only time signature supported.

- The app assumes that every dash represents a 16th note.
- For complete control over each bar, a 16 character pattern should be passed. If less characters are passed, then the pattern will repeat to fill out the bar.
- `x` is used to represent a note being played in that position. `-` is used to represent rests.
- A four-to-the-floor pattern would be expressed as `x---x---x---x---`
- `random` can be passed as a `pattern` to randomly generate a pattern

## Demo

The linked demo allows you to experiment with the tabbing syntax in real time.

[http://json-to-tab.surge.sh/](http://json-to-tab.surge.sh/)