# JSON to Guitar Tab
This is a tool to generate guitar tablature using JSON notatiion.

## Usage
```json
[
    {
        chords: ["D major"],
        pattern: "x---"
    },
    {
        chords: ["-57775", "577655"],
        pattern: "x--x-x-"
    }
]
```

This tool expects an array representing each bar of the resulting tab.

Each bar should contain an array of `chords` and a string representing a `pattern`

### Chords
There are 2 ways that chords can be written.

- Chords can be written in English (eg `A minor`) and if it is recognised a shape will be randomly selected.
The available extensions are `major`, `minor`, `7`, `maj7`, and `min7`. Any note in the chromatic scale can be used as a root. Flats and sharps should be converted appropriately.
- Chords can also be written as a 6 character string (`EADGBe`), where each character represents a string on the guitar.
For example, an `E major` chord could be written as `022100`. Fret numbers are hexadecimal, so frets from 0-15 can be expressed using this notation.

## Demo
[http://json-to-tab.surge.sh/](http://json-to-tab.surge.sh/)