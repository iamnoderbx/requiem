import { TweenService, Workspace } from "@rbxts/services";

export namespace Number {
    // actual  conversion code starts here

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    function convert_millions(num: number): string {
        if (num >= 1000000) {
            return convert_millions(math.floor(num / 1000000)) + " million " + convert_thousands(num % 1000000);
        } else {
            return convert_thousands(num);
        }
    }

    function convert_thousands(num: number) {
        if (num >= 1000) {
            return convert_hundreds(math.floor(num / 1000)) + " thousand " + convert_hundreds(num % 1000);
        } else {
            return convert_hundreds(num);
        }
    }

    function convert_hundreds(num: number) {
        if (num > 99) {
            return ones[math.floor(num / 100)] + " hundred " + convert_tens(num % 100);
        } else {
            return convert_tens(num);
        }
    }

    function convert_tens(num: number) {
        if (num < 10) return ones[num];
        else if (num >= 10 && num < 20) return teens[num - 10];
        else {
            return tens[math.floor(num / 10)] + " " + ones[num % 10];
        }
    }

    export function Wordify(num: number) {
        if (num === 0) return "zero";
        else return convert_millions(num);
    }

    export function GetLeadingTimestamp(timestamp: number) {
        const time_since = Workspace.GetServerTimeNow() - timestamp;
        if(time_since < 0) return "A few seconds"
        
        const seconds = time_since;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        if (days >= 1) {
            return `${math.floor(days)} ${days >= 2 ? "days" : "day"}`;
        } else if (hours >= 1) {
            return `${math.floor(hours)} ${hours >= 2 ? "hours" : "hour"}`;
        } else if (minutes >= 1) {
            return `${math.floor(minutes)} ${minutes >= 2 ? "minutes" : "minute"}`;
        } else {
            return `${math.floor(seconds)} ${seconds >= 2 ? "seconds" : "second"}`;
        }
    }

    // function format_int(number)

    //     local i, j, minus, int, fraction = tostring(number):find('([-]?)(%d+)([.]?%d*)')

    //     -- reverse the int-string and append a comma to all blocks of 3 digits
    //     int = int:reverse():gsub("(%d%d%d)", "%1,")

    //     -- reverse the int-string back remove an optional comma and put the 
    //     -- optional minus and fractional part back
    //     return minus .. int:reverse():gsub("^,", "") .. fraction
    // end

    export function AddCommasToNumber(num: number) {
        const T = tostring(num)
        const reversed = T.reverse()
        const [ subbed ] = reversed.gsub("%d%d%d", "%1,")
        const reversed2 = subbed.reverse()
        const [ subbed2 ] = reversed2.gsub("^,", "")

        return subbed2
    }

    export function FormatTimestamp(timestamp: number) {
        const date = os.date("*t", timestamp);;

        let year: string = tostring(date.year);

        // Remove the first two characters from the year
        year = tostring(tostring(date.year).sub(3, 4));

        return `${date.month}/${date.day}/${year}`;
    }

    export class Ease {
        private value: NumberValue = new Instance("NumberValue");
        private goal : number | undefined;


        constructor(initial: number, private target?: number, private tween?: TweenInfo) {
            this.value.Value = initial;
        }

        public Connect(callback: () => void) {
            let connection = this.value.Changed.Connect(() => {
                callback();
            });

            return () => {
                connection.Disconnect();
            }
        }

        public Get() {
            return this.value.Value;
        }

        public Instant(target: number) {
            this.value.Value = target
        }

        public EaseTo(target: number, tween?: TweenInfo) {
            this.target = target;
            this.tween = tween;

            this.Play();
        }

        public GetGoal() {
            return this.goal;
        }

        public Play() {
            const tween = TweenService.Create(this.value, this.tween ?? new TweenInfo(), {
                Value: this.target ?? this.value.Value
            });

            this.goal = this.target;

            tween.Play();
        }

        public Alive() {
            return this.value !== undefined;
        }

        public Destroy() {
            this.value.Destroy();
            this.value = undefined!;

            this.target = undefined!;

            this.tween = undefined!;
        }
    }
}