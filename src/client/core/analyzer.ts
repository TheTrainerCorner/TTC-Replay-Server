import { IAnalyzer } from "../interfaces/IReplay";

export class Analyzer implements IAnalyzer {
  data: {
    current: {
      p1: string;
      p2: string;
      p3?: string;
      p4?: string;
    };
    winner: string;
    p1: {
      username: string;
      pokemon: {
        nickname: string;
        pokemon: string;
        kills: number;
        isDead: boolean;
      }[];
    };
    p2: {
      username: string;
      pokemon: {
        nickname: string;
        pokemon: string;
        kills: number;
        isDead: boolean;
      }[];
    };
    p3?: {
      username: string;
      pokemon: {
        nickname: string;
        pokemon: string;
        kills: number;
        isDead: boolean;
      }[];
    };
    p4?: {
      username: string;
      pokemon: {
        nickname: string;
        pokemon: string;
        kills: number;
        isDead: boolean;
      }[];
    };
  } = {
    current: {
      p1: "",
      p2: "",
    },
    winner: "",
    p1: {
      username: "",
      pokemon: [],
    },
    p2: {
      username: "",
      pokemon: [],
    },
  };

  analyze(log: string): boolean {
    try {
      let lines = log.split("\n");
      for (let line of lines) {
        let sections = line.split("|");
        // We need to shift once to get rid of the white space in the front of the line.
        sections.shift();
        let action = sections.shift();
        switch (action) {
          case "player":
            if (sections[0] == "p1") {
              if (sections[1] !== this.data.p1!.username) {
                this.data.p1!.username = sections[1];
              }
            } else {
              if (sections[1] !== this.data.p2!.username) {
                this.data.p2!.username = sections[1];
              }
            }
            break;
          case "poke":
            if (sections[0] === "p1") {
              this.data.p1.pokemon.push({
                nickname: "",
                pokemon: sections[1].split(",")[0].replace("-*", ""),
                kills: 0,
                isDead: false,
              });
            } else {
              this.data.p2.pokemon.push({
                nickname: "",
                pokemon: sections[1].split(",")[0].replace("-*", ""),
                kills: 0,
                isDead: false,
              });
            }
            break;
          case "win":
            this.data.winner = sections[0];
            console.log("Done Analyzing!");
            /**
             * Structure
             * --------------------------------------
             * Winner: ----
             * Score: 0-0
             *
             * P1
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             *
             * P2
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * Pokemon,0,0
             * ----------------------------------------
             */

            return true;
          case "detailschange":
            let tes = sections[0].split(":");
            if (tes[0].replace("a", "") === "p1") {
              this.data.p1.pokemon.find(
                (x) => x.pokemon === this.data.current.p1
              )!.pokemon = sections[1].includes(",")
                ? sections[1].split(",")[0]
                : sections[1];
              this.data.current.p1 = sections[1].includes(",")
                ? sections[1].split(",")[0]
                : sections[1];
            } else {
              this.data.p2.pokemon.find(
                (x) => x.pokemon === this.data.current.p2
              )!.pokemon = sections[1].includes(",")
                ? sections[1].split(",")[0]
                : sections[1];
              this.data.current.p2 = sections[1].includes(",")
                ? sections[1].split(",")[0]
                : sections[1];
            }
            break;
          case "switch":
          case "drag":
            let ste = sections[0].split(":");
            if (ste[0].replace("a", "") === "p1") {
              this.data.current.p1 = sections[1].includes(",")
                ? sections[1].split(",")[0]
                : sections[1];
              console.log(this.data.p1.pokemon);
              this.data.p1.pokemon.find(
                (x) => x.pokemon === this.data.current.p1
              )!.nickname = ste[1].trim();
            } else {
              this.data.current.p2 = sections[1].includes(",")
                ? sections[1].split(",")[0]
                : sections[1];
              this.data.p2.pokemon.find(
                (x) => x.pokemon === this.data.current.p2
              )!.nickname = ste[1].trim();
            }
            break;
          case "faint":
            let set = sections[0].split(":");
            if (set[0].replace("a", "") === "p1") {
              this.data.p1.pokemon.find(
                (x) =>
                  x.pokemon === set[1].trim() || x.nickname == set[1].trim()
              )!.isDead = true;
              this.data.p2.pokemon.find(
                (x) => x.pokemon === this.data.current.p2
              )!.kills += 1;
            } else {
              this.data.p2.pokemon.find(
                (x) =>
                  x.pokemon === set[1].trim() || x.nickname == set[1].trim()
              )!.isDead = true;
              console.log(this.data.current.p1);
              this.data.p1.pokemon.find(
                (x) => x.pokemon === this.data.current.p1
              )!.kills += 1;
            }
            break;
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
