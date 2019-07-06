import * as _ from 'lodash';
import {
    IConfig,
    IElmDebugCustomValue,
    IFormatterElement,
    IJsonMLFormatter,
} from '../../CommonTypes';

import JsonML from '../../JsonML';
import EllipsisElement from './EllipsisElement';
import { CustomTypeNameStyle, KeyElementStyle } from './Styles';

export default class CustomTypeElement implements IFormatterElement {
    private elmObj: IElmDebugCustomValue;
    private formatter: IJsonMLFormatter;

    constructor(obj: IElmDebugCustomValue, formatter: IJsonMLFormatter) {
        this.elmObj = obj;
        this.formatter = formatter;
    }

    public header(config: IConfig = { elmFormat: true }) {
        const newConfig = _.clone(config);

        if (this.elmObj.value.length === 0) {
            return new JsonML('span')
                .withStyle(CustomTypeNameStyle)
                .withText(this.elmObj.name);
        }
        if (this.elmObj.value.length === 1) {
            _.set(newConfig, 'misc.isCustomChild', true);

            return this.wrappedHeader(
                new JsonML('span')
                    .withStyle(CustomTypeNameStyle)
                    .withText(this.elmObj.name + ' ')
                    .withChild(
                        this.formatter.handleHeader(
                            this.elmObj.value[0],
                            newConfig
                        )
                    ),
                config
            );
        } else {
            if (
                config !== null &&
                config.misc !== undefined &&
                config.misc.isCustomChild
            ) {
                return this.wrappedHeader(
                    new JsonML('span')
                        .withText(this.elmObj.name + ' ')
                        .withStyle(CustomTypeNameStyle)
                        .withChild(new EllipsisElement().header()),
                    config
                );
            } else {
                const children = this.elmObj.value
                    .map(child => {
                        _.set(newConfig, 'misc.isCustomChild', true);
                        return {
                            child,
                            jsonml: new JsonML('span').withChild(
                                this.formatter.handleHeader(child, newConfig)
                            ),
                        };
                    })

                    .reduce((acc, child) => {
                        acc.push(child.jsonml);
                        acc.push(new JsonML('span').withText(' '));
                        return acc;
                    }, []);

                children.splice(-1, 1);

                return this.wrappedHeader(
                    new JsonML('span')
                        .withText(this.elmObj.name + ' ')
                        .withStyle(CustomTypeNameStyle)
                        .withChildren(children),
                    config
                );
            }
        }
    }

    public body(): JsonML | null {
        if (
            this.elmObj.value.length === 1 &&
            this.formatter.handleBody(this.elmObj.value[0]) === null
        ) {
            return null;
        }

        const children = this.elmObj.value.map((child, index) => {
            const element = new JsonML('span')
                .withChild(
                    new JsonML('span')
                        .withStyle(KeyElementStyle)
                        .withText(`${index}`)
                )
                .withText(': ');

            if (this.formatter.handleBody(child) === null) {
                element.withStyle('margin-left: 13px;');
            }

            return new JsonML('div').withObject(element, child);
        });

        return new JsonML('div')
            .withStyle('margin-left: 15px;')
            .withChildren(children);
    }

    private wrappedHeader(obj: JsonML, config?: IConfig): JsonML {
        if (
            config !== null &&
            config.misc !== undefined &&
            config.misc.isCustomChild
        ) {
            return new JsonML('span')
                .withText('( ')
                .withChild(obj)
                .withText(' )');
        } else {
            return obj;
        }
    }
}
