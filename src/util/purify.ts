import * as _ from "lodash";
import * as traverse from "traverse";

// Get rid of circular references and replace values matched by key with a placeholder
export function purify(body: Object, keys: string[]): Object {

    const transformedBody = _.cloneDeep(body);

    traverse(transformedBody).forEach(function (value: any) {

        // scrub circular references
        // tslint:disable-next-line:no-invalid-this
        if (this.circular) {
            // tslint:disable-next-line:no-invalid-this
            this.remove();
        }

        // replace values
        // tslint:disable-next-line:no-invalid-this
        if (keys.find(key => key === this.key)) {
            // tslint:disable-next-line:no-invalid-this
            return `__PLACEHOLDER_FOR_${this.key}__`;
        }

        return value;
    });

    return transformedBody;

}
