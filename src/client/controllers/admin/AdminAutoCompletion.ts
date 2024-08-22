import { Requiem } from "shared/Requiem";
import { String } from "shared/utilities/string.utilities";

export namespace AdminAutoCompletion {
    const COLOR_REPLACEMENTS = {
        "@player": Color3.fromRGB(112, 143, 108),
        "@number": Color3.fromRGB(102, 150, 255),
    }

    export function StringifyOptions(options : (string | Instance)) : Array<string> {
        if(typeOf(options) === "string") return [];
        if(typeOf(options) === "table") return options as unknown as Array<string>;
        return (options as Instance).GetChildren().map((value) => value.Name);
    }

    export function AutofillFromArray(text : string, array : Array<string | Instance>) : Array<string> {
        const stringified = array.map((value) => {
            if(typeOf(value) === "string") return value;
            return (value as Instance).Name;
        }) as Array<string>;

        const split = String.splitString(text, " ");
        
        // Search through the stringified array matches, return a new array of matches
        return stringified.filter((value) => {
            return string.lower(string.sub(value, 1, split[split.size() - 1].size())) === string.lower(split[split.size() - 1])
        })
    }

    export function CreateScalingDescriptionLabel(array : Array<[string, string?, number?]>) {
        const holder = new Instance("Frame")
        holder.Size = new UDim2(0.987, 0, 2.693, 0);
        holder.BackgroundTransparency = 1;
        holder.AnchorPoint = new Vector2(0, 1);
        holder.Position = new UDim2(0.012, 0, -0.172, 0);

        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Vertical;
        layout.HorizontalAlignment = Enum.HorizontalAlignment.Left;
        layout.VerticalAlignment = Enum.VerticalAlignment.Bottom;
        layout.Padding = new UDim(0, 2);
        layout.SortOrder = Enum.SortOrder.LayoutOrder;

        layout.Parent = holder;

        const scaler : TextLabel[] = [];

        array.forEach(([header, body, layout]) => {
            // Check to see if the body contains the string, "@notice<"
            const notice = body?.find("@notice<");
            let __label : Frame & { padder : TextLabel } | undefined = undefined;

            // Get the text inbetween the < and > characters for the notice.
            if(notice) {
                const start = body!.find("\@notice\<")[0];
                const ending = body!.find("\>")[0];
                const noticeText = body!.sub(start! + 8, ending! - 1);

                // Remove the notice from the body
                body = body!.gsub("@notice<" + noticeText + ">", "")[0];
               
                const label = Requiem.Assets.other.autoscale_notice.Clone();
                if(header in COLOR_REPLACEMENTS) {
                    label.container.body.label.TextColor3 = COLOR_REPLACEMENTS[header as keyof typeof COLOR_REPLACEMENTS];
                }

                label.container.body.label.Text = header;

                if(label.container.body.description && body) {
                    label.container.body.description.Text = body;
                } else {
                    label.container.body.description.Visible = false;
                }

                label.container.notice.Text = noticeText;

                __label = label;
            } else {
                const label = Requiem.Assets.other.autoscale_desc.Clone();
            
                if(header in COLOR_REPLACEMENTS) {
                    label.container.label.TextColor3 = COLOR_REPLACEMENTS[header as keyof typeof COLOR_REPLACEMENTS];
                }

                label.container.label.Text = header;

                if(label.container.description && body) {
                    label.container.description.Text = body;
                } else {
                    label.container.description.Visible = false;
                }

                __label = label;
            }

            __label!.Parent = holder;

            if(layout) [
                __label!.LayoutOrder = layout
            ]

            scaler.push(__label!.padder)
        })

        return { holder, scaler };
    }

    export function CreateDescriptionLabel(array : Array<[string, string]>) {
        const holder = new Instance("Frame")
        holder.Size = new UDim2(1, 0, 2.693, 0);
        holder.BackgroundTransparency = 1;
        holder.AnchorPoint = new Vector2(0, 1);
        holder.Position = new UDim2(0, 0, -0.172, 0);

        const layout = new Instance("UIListLayout");
        layout.FillDirection = Enum.FillDirection.Vertical;
        layout.HorizontalAlignment = Enum.HorizontalAlignment.Left;
        layout.VerticalAlignment = Enum.VerticalAlignment.Bottom;
        layout.Padding = new UDim(0, 2);

        layout.Parent = holder;
        
        array.forEach(([header, body]) => {
            const label = Requiem.Assets.other.autofill_desc.Clone();
            
            label.label.Text = header;
            label.description.Text = body;

            label.Parent = holder;
        })
        

        return holder;
    }
}