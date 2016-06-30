// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/7de6c3dd94feaeb21f20054b9f30d5dabc5efabd/url-template/url-template.d.ts
declare namespace UrlTemplate
{
    interface TemplateParser {
        parse(template: string): Template;
    }

    interface Template {
        expand(parameters: any): string;
    }
}

declare module "url-template"
{
    var urlTemplate: UrlTemplate.TemplateParser;

    export = urlTemplate;
}