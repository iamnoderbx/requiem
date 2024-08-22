import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";

export function BranchMemberGridComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return <frame
        AnchorPoint={new Vector2(0.5, 0)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={new UDim2(0.499, 0, 0, 60)}
        Size={UDim2.fromScale(0.938, 0.725)}
        Key={"page1"}
    >
        <uigridlayout
            Key={"UIGridLayout1"}
            CellSize={new UDim2(0.1, -5, 0.5, 0)}
            SortOrder={Enum.SortOrder.LayoutOrder}
        />

        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint1"}
            AspectRatio={3.72}
        />

        {props[Roact.Children]}
    </frame>
}

export function BranchManageMembersGridComponent(props: {} & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={new UDim2(0.499, 0, 0, 60)}
            Size={UDim2.fromScale(0.938, 0.725)}
            Key={"page1"}
        >
            <uigridlayout
                Key={"UIGridLayout1"}
                CellPadding={UDim2.fromOffset(2, 2)}
                CellSize={UDim2.fromScale(0.33, 0.3)}
                SortOrder={Enum.SortOrder.LayoutOrder}
            />

            {props[Roact.Children]}
        </frame>
    )
}

export function BranchMemberSearchBarComponent(props: { OnSearchRequest: (name: string) => void } & Roact.PropsWithChildren): Roact.Element {
    return <imagelabel
        Image={"rbxassetid://16255699706"}
        ImageColor3={Color3.fromRGB(149, 197, 255)}
        ImageTransparency={0.99}
        ScaleType={Enum.ScaleType.Crop}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(19, 20, 24)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.534, 0.48)}
        Size={UDim2.fromScale(0.267, 1.04)}
        Key={"menu2"}
        LayoutOrder={2}
    >
        <uicorner
            Key={"UICorner1"}
            CornerRadius={new UDim(0.4, 0)}
        />

        <uistroke
            Key={"UIStroke1"}
            Color={Color3.fromRGB(44, 48, 62)}
        />

        <textbox
            CursorPosition={-1}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            PlaceholderText={"Click here to search."}
            Text={""}
            TextColor3={Color3.fromRGB(248, 248, 248)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.48}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            Active={false}
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.0704, 0.5)}
            Selectable={false}
            Size={UDim2.fromScale(0.826, 0.553)}
            ZIndex={2}
            Key={"name1"}
            Event={{
                FocusLost: (textbox) => {
                    props.OnSearchRequest(textbox.Text);
                }
            }}
        />
    </imagelabel>
}

export function BranchMemberPaginationComponent(props: { Page: number, OnPageChanged: (frame: Frame, newPage: number, change: number) => void } & Roact.PropsWithChildren): Roact.Element {
    return <frame
        AnchorPoint={new Vector2(1, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(1.03, 0.5)}
        Size={UDim2.fromScale(0.107, 0.854)}
        Key={"pageination1"}
        LayoutOrder={3}
    >
        <uilistlayout
            Key={"UIListLayout1"}
            ItemLineAlignment={Enum.ItemLineAlignment.Center}
            Padding={new UDim(0.02, 0)}
            FillDirection={Enum.FillDirection.Horizontal}
            HorizontalAlignment={Enum.HorizontalAlignment.Right}
            SortOrder={Enum.SortOrder.LayoutOrder}
            VerticalAlignment={Enum.VerticalAlignment.Center}
        />

        <textlabel
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            RichText={true}
            Text={"Page " + tostring(props.Page + 1)}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.4}
            TextWrapped={true}
            TextYAlignment={Enum.TextYAlignment.Bottom}
            AutomaticSize={Enum.AutomaticSize.X}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={1}
            Position={UDim2.fromScale(0, 0.739)}
            Size={UDim2.fromScale(0.542, 0.782)}
            ZIndex={2}
            Key={"name1"}
        />

        <imagebutton
            Image={"rbxassetid://11419703997"}
            ImageTransparency={0.65}
            AnchorPoint={new Vector2(1, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={2}
            Position={UDim2.fromScale(5.69, 0.478)}
            Size={UDim2.fromScale(0.203, 0.652)}
            Key={"next1"}
            Event={{
                MouseButton1Click: (button) => {
                    props.OnPageChanged(button.Parent!.Parent!.Parent! as Frame, props.Page + 1, 1);
                }
            }}
        >
            <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
        </imagebutton>

        <imagebutton
            Image={"rbxassetid://11293981980"}
            ImageTransparency={0.65}
            AnchorPoint={new Vector2(1, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(4.75, 0.478)}
            Size={UDim2.fromScale(0.203, 0.652)}
            Key={"previous1"}
            Event={{
                MouseButton1Click: (button) => {
                    props.OnPageChanged(button.Parent!.Parent!.Parent! as Frame, props.Page - 1, -1);
                }
            }}
        >
            <uiaspectratioconstraint Key={"UIAspectRatioConstraint"} />
        </imagebutton>

        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint1"}
            AspectRatio={3.21}
        />
    </frame>
}

export function BranchMemberHeaderComponent(props: {Alignment?: Enum.HorizontalAlignment} & Roact.PropsWithChildren): Roact.Element {
    return <frame
        AnchorPoint={new Vector2(1, 0.5)}
        BackgroundColor3={Color3.fromRGB(41, 42, 48)}
        BackgroundTransparency={1}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={new UDim2(0.97, 0, 0, 26)}
        Size={UDim2.fromScale(0.644, 0.0722)}
        Key={"selection1"}
        ZIndex={5}
    >
        <uicorner
            Key={"UICorner1"}
            CornerRadius={new UDim(0.2, 0)}
        />

        {props[Roact.Children]}

        <uiaspectratioconstraint
            Key={"UIAspectRatioConstraint1"}
            AspectRatio={25.6}
        />

        <uilistlayout
            Key={"UIListLayout1"}
            Padding={new UDim(0, 15)}
            FillDirection={Enum.FillDirection.Horizontal}
            HorizontalAlignment={props.Alignment ?? Enum.HorizontalAlignment.Right}
            SortOrder={Enum.SortOrder.LayoutOrder}
            VerticalAlignment={Enum.VerticalAlignment.Center}
        />
    </frame>
}

export default function BranchMembersComponent(props: { Visible?: boolean, Size?: UDim2 } & Roact.PropsWithChildren): Roact.Element {
    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={3}
            Position={UDim2.fromScale(0.0184, 0.467)}
            Size={props.Size ?? UDim2.fromScale(0.962, 0.501)}
            Key={"members1"}
            Visible={props.Visible}
        >
            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(6, 8, 12)}
                BackgroundTransparency={0.15}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={5}
                Key={"locked"}
                Visible={false}
            >
                <uicorner Key={"UICorner"} />
            </frame>

            <imagelabel
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(149, 197, 255)}
                ImageTransparency={0.97}
                ScaleType={Enum.ScaleType.Crop}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(31, 33, 39)}
                BackgroundTransparency={0.35}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                ZIndex={0}
                Key={"menu1"}
            >
                <uicorner Key={"UICorner"} />
            </imagelabel>

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.Bold,
                    Enum.FontStyle.Normal
                )}
                RichText={true}
                Text={"Branch Members"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.24}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Bottom}
                AutomaticSize={Enum.AutomaticSize.X}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={new UDim2(0.03, 0, 0, 18)}
                Size={UDim2.fromScale(0.591, 0.052)}
                ZIndex={2}
                Key={"name1"}
            >
                <uiaspectratioconstraint
                    Key={"UIAspectRatioConstraint1"}
                    AspectRatio={32.6}
                />
            </textlabel>

            {props[Roact.Children]}
        </frame>
    )
}

markPureComponent(BranchMembersComponent);
markPureComponent(BranchMemberGridComponent);
markPureComponent(BranchManageMembersGridComponent);
markPureComponent(BranchMemberSearchBarComponent);
markPureComponent(BranchMemberPaginationComponent);
markPureComponent(BranchMemberHeaderComponent);