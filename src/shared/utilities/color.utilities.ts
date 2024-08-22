export namespace Color {
    // local function from_hex(hex: string): Color3
    //         local r, g, b = string.match(hex, "^#?(%w%w)(%w%w)(%w%w)$")
    //         return Color3.fromRGB(tonumber(r, 16),
    //                 tonumber(g, 16), tonumber(b, 16))
    // end
    // local function to_hex(color: Color3): string
    //         return string.format("#%02X%02X%02X", color.R * 0xFF,
    //                 color.G * 0xFF, color.B * 0xFF)
    // end

    export function fromHex(hex: string): Color3 {
        const [ r, g, b ] = string.match(hex, "^#?(%w%w)(%w%w)(%w%w)$");
        if(!r || !g || !b) return new Color3(0, 0, 0);
        
        return new Color3(
            tonumber(r, 16)! / 255,
            tonumber(g, 16)! / 255,
            tonumber(b, 16)! / 255
        );
    }

    export function toHex(color: Color3): string {
        return string.format("#%02X%02X%02X", color.R * 255, color.G * 255, color.B * 255);
    }

    export function random() {
        return new Color3(math.random(), math.random(), math.random());
    }
}